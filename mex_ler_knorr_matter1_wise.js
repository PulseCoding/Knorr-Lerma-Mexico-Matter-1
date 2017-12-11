//Rechazos marcados con cero requieren lógica de rechazos
var fs = require('fs');
var PubNub = require('pubnub');
var modbus = require('jsmodbus');

try{

var publishConfig;
var secEOL=0,secPubNub=0,
    CntInWrapperBottle = null,
    CntInWrapperBox = null;
var Fillerct = null,
    Fillerresults = null,
    CntInFiller = null,
    CntOutFiller = null,
    Filleractual = 0,
    Fillertime = 0,
    Fillersec = 0,
    FillerflagStopped = false,
    Fillerstate = 0,
    Fillerspeed = 0,
    FillerspeedTemp = 0,
    FillerflagPrint = 0,
    FillersecStop = 0,
    FillerONS = false,
    FillertimeStop = 60, //NOTE: Timestop
    FillerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    FillerflagRunning = false;
var Capperct = null,
    Capperresults = null,
    CntInCapper = null,
    CntOutCapper = null,
    Capperactual = 0,
    Cappertime = 0,
    Cappersec = 0,
    CapperflagStopped = false,
    Capperstate = 0,
    Capperspeed = 0,
    CapperspeedTemp = 0,
    CapperflagPrint = 0,
    CappersecStop = 0,
    CapperONS = false,
    CappertimeStop = 60, //NOTE: Timestop
    CapperWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CapperflagRunning = false;
var Labellerct = null,
    Labellerresults = null,
    CntInLabeller = null,
    CntOutLabeller = null,
    Labelleractual = 0,
    Labellertime = 0,
    Labellersec = 0,
    LabellerflagStopped = false,
    Labellerstate = 0,
    Labellerspeed = 0,
    LabellerspeedTemp = 0,
    LabellerflagPrint = 0,
    LabellersecStop = 0,
    LabellerONS = false,
    LabellertimeStop = 60, //NOTE: Timestop
    LabellerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    LabellerflagRunning = false;
var Lainerct = null,
    Lainerresults = null,
    CntInLainer = null,
    CntOutLainer = null,
    Laineractual = 0,
    Lainertime = 0,
    Lainersec = 0,
    LainerflagStopped = false,
    Lainerstate = 0,
    Lainerspeed = 0,
    LainerspeedTemp = 0,
    LainerflagPrint = 0,
    LainersecStop = 0,
    LainerONS = false,
    LainertimeStop = 60, //NOTE: Timestop
    LainerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    LainerflagRunning = false;
var XRay2ct = null,
    XRay2results = null,
    CntInXRay2 = null,
    CntOutXRay2 = null,
    XRay2actual = 0,
    XRay2time = 0,
    XRay2sec = 0,
    XRay2flagStopped = false,
    XRay2state = 0,
    XRay2speed = 0,
    XRay2speedTemp = 0,
    XRay2flagPrint = 0,
    XRay2secStop = 0,
    XRay2ONS = false,
    XRay2timeStop = 60, //NOTE: Timestop
    XRay2Worktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    XRay2flagRunning = false;
var Wrapperct = null,
    Wrapperresults = null,
    CntOutWrapper = null,
    Wrapperactual = 0,
    Wrappertime = 0,
    Wrappersec = 0,
    WrapperflagStopped = false,
    Wrapperstate = 0,
    Wrapperspeed = 0,
    WrapperspeedTemp = 0,
    WrapperflagPrint = 0,
    WrappersecStop = 0,
    WrapperONS = false,
    WrappertimeStop = 60, //NOTE: Timestop
    WrapperWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    WrapperflagRunning = false;
    var init1,init2,init3;

var files = fs.readdirSync("C:/PULSE/MATTER1_LOGS/"); //Leer documentos
var text2send=[];//Vector a enviar
var i=0;

var pubnub = new PubNub({
  publishKey : "pub-c-8d024e5b-23bc-4ce8-ab68-b39b00347dfb",
  subscribeKey : "sub-c-c3b3aa54-b44b-11e7-895e-c6a8ff6a3d85",
  uuid : "lermat1-0000-1234"
});

function senderData(){
  pubnub.publish(publishConfig, function(status, response) {
                  });
}



function idle(){
  i=0;
  text2send=[];
  for (var k=0;k<files.length;k++){//Verificar los archivos
    var stats = fs.statSync("C:/PULSE/MATTER1_LOGS/"+files[k]);
    var mtime = new Date(stats.mtime).getTime();
    if (mtime< (Date.now() - (15*60*1000))&&files[k].indexOf("serialbox")==-1){
      text2send[i]=files[k];
      i++;
    }
  }
}
setInterval(function(){


  if(secPubNub>=60*5){
    secPubNub=0;
    idle();
    publishConfig = {
      channel : "Lerma_Monitor",
      message : {
            line: "Matter1",
            tt: Date.now(),
          machines:text2send
        }
    };
    senderData();
  }else{
    secPubNub++;
  }
},1000);

  var client1 = modbus.client.tcp.complete({
    'host': "192.168.10.98",
    'port': 502,
    'autoReconnect': true,
    'timeout': 60000,
    'logEnabled': true,
    'reconnectTimeout' : 30000
  });
  var client2 = modbus.client.tcp.complete({
    'host': "192.168.10.99",
    'port': 502,
    'autoReconnect': true,
    'timeout': 60000,
    'logEnabled': true,
    'reconnectTimeout' : 30000
  });

  var client3 = modbus.client.tcp.complete({
    'host': "192.168.10.100",
    'port': 502,
    'autoReconnect': true,
    'timeout': 60000,
    'logEnabled': true,
    'reconnectTimeout' : 30000
  });

  client1.connect();
  client2.connect();
  client3.connect();


  function joinWord(num1, num2) {
    var bits = "00000000000000000000000000000000";
    var bin1 = num1.toString(2),
      bin2 = num2.toString(2),
      newNum = bits.split("");

    for (i = 0; i < bin1.length; i++) {
      newNum[31 - i] = bin1[(bin1.length - 1) - i];
    }
    for (i = 0; i < bin2.length; i++) {
      newNum[15 - i] = bin2[(bin2.length - 1) - i];
    }
    bits = newNum.join("");
    return parseInt(bits, 2);
  }

  client1.on('connect', function(err) {
    init1=  setInterval(function(){


          client1.readHoldingRegisters(0, 16).then(function(resp) {
            CntInFiller = joinWord(resp.register[0], resp.register[1]);
            CntOutFiller =  joinWord(resp.register[2], resp.register[3]);
        //------------------------------------------Filler----------------------------------------------
              Fillerct = CntOutFiller // NOTE: igualar al contador de salida
              if (!FillerONS && Fillerct) {
                FillerspeedTemp = Fillerct
                Fillersec = Date.now()
                FillerONS = true
                Fillertime = Date.now()
              }
              if(Fillerct > Filleractual){
                if(FillerflagStopped){
                  Fillerspeed = Fillerct - FillerspeedTemp
                  FillerspeedTemp = Fillerct
                  Fillersec = Date.now()
                  Fillertime = Date.now()
                }
                FillersecStop = 0
                Fillerstate = 1
                FillerflagStopped = false
                FillerflagRunning = true
              } else if( Fillerct == Filleractual ){
                if(FillersecStop == 0){
                  Fillertime = Date.now()
                  FillersecStop = Date.now()
                }
                if( ( Date.now() - ( FillertimeStop * 1000 ) ) >= FillersecStop ){
                  Fillerspeed = 0
                  Fillerstate = 2
                  FillerspeedTemp = Fillerct
                  FillerflagStopped = true
                  FillerflagRunning = false
                  FillerflagPrint = 1
                }
              }
              Filleractual = Fillerct
              if(Date.now() - 60000 * FillerWorktime >= Fillersec && FillersecStop == 0){
                if(FillerflagRunning && Fillerct){
                  FillerflagPrint = 1
                  FillersecStop = 0
                  Fillerspeed = Fillerct - FillerspeedTemp
                  FillerspeedTemp = Fillerct
                  Fillersec = Date.now()
                }
              }
              Fillerresults = {
                ST: Fillerstate,
                CPQI: CntInFiller,
                CPQO: CntOutFiller,
                SP: Fillerspeed
              }
              if (FillerflagPrint == 1) {
                for (var key in Fillerresults) {
                  if( Fillerresults[key] != null && ! isNaN(Fillerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/MATTER1_LOGS/mex_ler_Filler_matter1.log', 'tt=' + Fillertime + ',var=' + key + ',val=' + Fillerresults[key] + '\n')
                }
                FillerflagPrint = 0
                FillersecStop = 0
                Fillertime = Date.now()
              }
        //------------------------------------------Filler----------------------------------------------

          });//Cierre de lectura

        },1000);
    });//Cierre de cliente

        client1.on('error', function(err) {
          clearInterval(init1);
        });
        client1.on('close', function() {
          clearInterval(init1);

        });

        client2.on('connect', function(err) {
              init2= setInterval(function(){

        client2.readHoldingRegisters(0, 16).then(function(resp) {
          CntOutLainer = joinWord(resp.register[2], resp.register[3]);
          CntOutLabeller = joinWord(resp.register[4], resp.register[5]);
          CntInLabeller = joinWord(resp.register[6], resp.register[7]);
          CntOutCapper = joinWord(resp.register[8], resp.register[9]);
          CntInCapper = CntOutFiller;
          CntInLainer = CntOutLabeller;
        //------------------------------------------Capper----------------------------------------------
              Capperct = CntOutCapper // NOTE: igualar al contador de salida
              if (!CapperONS && Capperct) {
                CapperspeedTemp = Capperct
                Cappersec = Date.now()
                CapperONS = true
                Cappertime = Date.now()
              }
              if(Capperct > Capperactual){
                if(CapperflagStopped){
                  Capperspeed = Capperct - CapperspeedTemp
                  CapperspeedTemp = Capperct
                  Cappersec = Date.now()
                  Cappertime = Date.now()
                }
                CappersecStop = 0
                Capperstate = 1
                CapperflagStopped = false
                CapperflagRunning = true
              } else if( Capperct == Capperactual ){
                if(CappersecStop == 0){
                  Cappertime = Date.now()
                  CappersecStop = Date.now()
                }
                if( ( Date.now() - ( CappertimeStop * 1000 ) ) >= CappersecStop ){
                  Capperspeed = 0
                  Capperstate = 2
                  CapperspeedTemp = Capperct
                  CapperflagStopped = true
                  CapperflagRunning = false
                  CapperflagPrint = 1
                }
              }
              Capperactual = Capperct
              if(Date.now() - 60000 * CapperWorktime >= Cappersec && CappersecStop == 0){
                if(CapperflagRunning && Capperct){
                  CapperflagPrint = 1
                  CappersecStop = 0
                  Capperspeed = Capperct - CapperspeedTemp
                  CapperspeedTemp = Capperct
                  Cappersec = Date.now()
                }
              }
              Capperresults = {
                ST: Capperstate,
                CPQI: CntInCapper,
                CPQO: CntOutCapper,
                SP: Capperspeed
              }
              if (CapperflagPrint == 1) {
                for (var key in Capperresults) {
                  if( Capperresults[key] != null && ! isNaN(Capperresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/MATTER1_LOGS/mex_ler_Capper_matter1.log', 'tt=' + Cappertime + ',var=' + key + ',val=' + Capperresults[key] + '\n')
                }
                CapperflagPrint = 0
                CappersecStop = 0
                Cappertime = Date.now()
              }
        //------------------------------------------Capper----------------------------------------------
        //------------------------------------------Labeller----------------------------------------------
              Labellerct = CntOutLabeller // NOTE: igualar al contador de salida
              if (!LabellerONS && Labellerct) {
                LabellerspeedTemp = Labellerct
                Labellersec = Date.now()
                LabellerONS = true
                Labellertime = Date.now()
              }
              if(Labellerct > Labelleractual){
                if(LabellerflagStopped){
                  Labellerspeed = Labellerct - LabellerspeedTemp
                  LabellerspeedTemp = Labellerct
                  Labellersec = Date.now()
                  Labellertime = Date.now()
                }
                LabellersecStop = 0
                Labellerstate = 1
                LabellerflagStopped = false
                LabellerflagRunning = true
              } else if( Labellerct == Labelleractual ){
                if(LabellersecStop == 0){
                  Labellertime = Date.now()
                  LabellersecStop = Date.now()
                }
                if( ( Date.now() - ( LabellertimeStop * 1000 ) ) >= LabellersecStop ){
                  Labellerspeed = 0
                  Labellerstate = 2
                  LabellerspeedTemp = Labellerct
                  LabellerflagStopped = true
                  LabellerflagRunning = false
                  LabellerflagPrint = 1
                }
              }
              Labelleractual = Labellerct
              if(Date.now() - 60000 * LabellerWorktime >= Labellersec && LabellersecStop == 0){
                if(LabellerflagRunning && Labellerct){
                  LabellerflagPrint = 1
                  LabellersecStop = 0
                  Labellerspeed = Labellerct - LabellerspeedTemp
                  LabellerspeedTemp = Labellerct
                  Labellersec = Date.now()
                }
              }
              Labellerresults = {
                ST: Labellerstate,
                CPQI: CntInLabeller,
                CPQO: CntOutLabeller,
                SP: Labellerspeed
              }
              if (LabellerflagPrint == 1) {
                for (var key in Labellerresults) {
                  if( Labellerresults[key] != null && ! isNaN(Labellerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/MATTER1_LOGS/mex_ler_Labeller_matter1.log', 'tt=' + Labellertime + ',var=' + key + ',val=' + Labellerresults[key] + '\n')
                }
                LabellerflagPrint = 0
                LabellersecStop = 0
                Labellertime = Date.now()
              }
        //------------------------------------------Labeller----------------------------------------------
        //------------------------------------------Lainer----------------------------------------------
              Lainerct = CntOutLainer // NOTE: igualar al contador de salida
              if (!LainerONS && Lainerct) {
                LainerspeedTemp = Lainerct
                Lainersec = Date.now()
                LainerONS = true
                Lainertime = Date.now()
              }
              if(Lainerct > Laineractual){
                if(LainerflagStopped){
                  Lainerspeed = Lainerct - LainerspeedTemp
                  LainerspeedTemp = Lainerct
                  Lainersec = Date.now()
                  Lainertime = Date.now()
                }
                LainersecStop = 0
                Lainerstate = 1
                LainerflagStopped = false
                LainerflagRunning = true
              } else if( Lainerct == Laineractual ){
                if(LainersecStop == 0){
                  Lainertime = Date.now()
                  LainersecStop = Date.now()
                }
                if( ( Date.now() - ( LainertimeStop * 1000 ) ) >= LainersecStop ){
                  Lainerspeed = 0
                  Lainerstate = 2
                  LainerspeedTemp = Lainerct
                  LainerflagStopped = true
                  LainerflagRunning = false
                  LainerflagPrint = 1
                }
              }
              Laineractual = Lainerct
              if(Date.now() - 60000 * LainerWorktime >= Lainersec && LainersecStop == 0){
                if(LainerflagRunning && Lainerct){
                  LainerflagPrint = 1
                  LainersecStop = 0
                  Lainerspeed = Lainerct - LainerspeedTemp
                  LainerspeedTemp = Lainerct
                  Lainersec = Date.now()
                }
              }
              Lainerresults = {
                ST: Lainerstate,
                CPQI: CntInLainer,
                CPQO: CntOutLainer,
                SP: Lainerspeed
              }
              if (LainerflagPrint == 1) {
                for (var key in Lainerresults) {
                  if( Lainerresults[key] != null && ! isNaN(Lainerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/MATTER1_LOGS/mex_ler_Lainer_matter1.log', 'tt=' + Lainertime + ',var=' + key + ',val=' + Lainerresults[key] + '\n')
                }
                LainerflagPrint = 0
                LainersecStop = 0
                Lainertime = Date.now()
              }
        //------------------------------------------Lainer----------------------------------------------
        });//Cierre de lectura

        },1000);
        });//Cierre de cliente

        client2.on('error', function(err) {
          clearInterval(init2);
        });
        client2.on('close', function() {
          clearInterval(init2);
        });


        client3.on('connect', function(err) {
          init3=  setInterval(function(){


                client3.readHoldingRegisters(0, 16).then(function(resp) {
                  CntOutWrapper = joinWord(resp.register[0], resp.register[1]);
                  CntInWrapperBottle = joinWord(resp.register[6], resp.register[7]);
                  CntInWrapperBox = joinWord(resp.register[8], resp.register[9]);
                  CntOutXRay2 = CntInWrapperBottle;
                  CntInXRay2 = CntOutLainer;
        //------------------------------------------XRay2----------------------------------------------
              XRay2ct = CntOutXRay2 // NOTE: igualar al contador de salida
              if (!XRay2ONS && XRay2ct) {
                XRay2speedTemp = XRay2ct
                XRay2sec = Date.now()
                XRay2ONS = true
                XRay2time = Date.now()
              }
              if(XRay2ct > XRay2actual){
                if(XRay2flagStopped){
                  XRay2speed = XRay2ct - XRay2speedTemp
                  XRay2speedTemp = XRay2ct
                  XRay2sec = Date.now()
                  XRay2time = Date.now()
                }
                XRay2secStop = 0
                XRay2state = 1
                XRay2flagStopped = false
                XRay2flagRunning = true
              } else if( XRay2ct == XRay2actual ){
                if(XRay2secStop == 0){
                  XRay2time = Date.now()
                  XRay2secStop = Date.now()
                }
                if( ( Date.now() - ( XRay2timeStop * 1000 ) ) >= XRay2secStop ){
                  XRay2speed = 0
                  XRay2state = 2
                  XRay2speedTemp = XRay2ct
                  XRay2flagStopped = true
                  XRay2flagRunning = false
                  XRay2flagPrint = 1
                }
              }
              XRay2actual = XRay2ct
              if(Date.now() - 60000 * XRay2Worktime >= XRay2sec && XRay2secStop == 0){
                if(XRay2flagRunning && XRay2ct){
                  XRay2flagPrint = 1
                  XRay2secStop = 0
                  XRay2speed = XRay2ct - XRay2speedTemp
                  XRay2speedTemp = XRay2ct
                  XRay2sec = Date.now()
                }
              }
              XRay2results = {
                ST: XRay2state,
                CPQI: CntInXRay2,
                CPQO: CntOutXRay2,
                SP: XRay2speed
              }
              if (XRay2flagPrint == 1) {
                for (var key in XRay2results) {
                  if( XRay2results[key] != null && ! isNaN(XRay2results[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/MATTER1_LOGS/mex_ler_XRay2_matter1.log', 'tt=' + XRay2time + ',var=' + key + ',val=' + XRay2results[key] + '\n')
                }
                XRay2flagPrint = 0
                XRay2secStop = 0
                XRay2time = Date.now()
              }
        //------------------------------------------XRay2----------------------------------------------
        //------------------------------------------Wrapper----------------------------------------------
              Wrapperct = CntOutWrapper // NOTE: igualar al contador de salida
              if (!WrapperONS && Wrapperct) {
                WrapperspeedTemp = Wrapperct
                Wrappersec = Date.now()
                WrapperONS = true
                Wrappertime = Date.now()
              }
              if(Wrapperct > Wrapperactual){
                if(WrapperflagStopped){
                  Wrapperspeed = Wrapperct - WrapperspeedTemp
                  WrapperspeedTemp = Wrapperct
                  Wrappersec = Date.now()
                  Wrappertime = Date.now()
                }
                WrappersecStop = 0
                Wrapperstate = 1
                WrapperflagStopped = false
                WrapperflagRunning = true
              } else if( Wrapperct == Wrapperactual ){
                if(WrappersecStop == 0){
                  Wrappertime = Date.now()
                  WrappersecStop = Date.now()
                }
                if( ( Date.now() - ( WrappertimeStop * 1000 ) ) >= WrappersecStop ){
                  Wrapperspeed = 0
                  Wrapperstate = 2
                  WrapperspeedTemp = Wrapperct
                  WrapperflagStopped = true
                  WrapperflagRunning = false
                  WrapperflagPrint = 1
                }
              }
              Wrapperactual = Wrapperct
              if(Date.now() - 60000 * WrapperWorktime >= Wrappersec && WrappersecStop == 0){
                if(WrapperflagRunning && Wrapperct){
                  WrapperflagPrint = 1
                  WrappersecStop = 0
                  Wrapperspeed = Wrapperct - WrapperspeedTemp
                  WrapperspeedTemp = Wrapperct
                  Wrappersec = Date.now()
                }
              }
              Wrapperresults = {
                ST: Wrapperstate,
                CPQIBOTTLE: CntInWrapperBottle,
                CPQICARTON: CntInWrapperBox,
                CPQO: CntOutWrapper,
                SP: Wrapperspeed
              }
              if (WrapperflagPrint == 1) {
                for (var key in Wrapperresults) {
                  if( Wrapperresults[key] != null && ! isNaN(Wrapperresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/MATTER1_LOGS/mex_ler_Wrapper_matter1.log', 'tt=' + Wrappertime + ',var=' + key + ',val=' + Wrapperresults[key] + '\n')
                }
                WrapperflagPrint = 0
                WrappersecStop = 0
                Wrappertime = Date.now()
              }
        //------------------------------------------Wrapper----------------------------------------------
        /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
              if(secEOL>=60 && CntOutWrapper){
                fs.appendFileSync("C:/PULSE/MATTER1_LOGS/mex_ler_EOL_matter1.log","tt="+Date.now()+",var=EOL"+",val="+CntOutWrapper+"\n");
                secEOL=0;
              }else{
                secEOL++;
              }
        /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/



        });//Cierre de lectura

      },1000);
  });//Cierre de cliente

client3.on('error', function(err) {
  clearInterval(init3);
});
client3.on('close', function() {
  clearInterval(init3);
});





}catch(err){
fs.appendFileSync("error.log",err + '\n');
}
