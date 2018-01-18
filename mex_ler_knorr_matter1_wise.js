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
    Filleractual = 0,
    Fillertime = 0,
    Fillersec = 0,
    FillerflagStopped = false,
    Fillerstate = 0,
    Fillerspeed = 0,
    FillerspeedTemp = 0,
    FillerflagPrint = 0,
    FillersecStop = 0,
    FillerdeltaRejected = null,
    FillerONS = 0,
    FillerStartTime = null,
    FillertimeStop = 30, //NOTE: Timestop
    FillerWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
    FillerflagRunning = false,
    FillerRejectFlag = false,
    FillerReject,
    CntOutFiller=null,
    CntInFiller=null;
var Capperct = null,
    Capperresults = null,
    Capperactual = 0,
    Cappertime = 0,
    Cappersec = 0,
    CapperflagStopped = false,
    Capperstate = 0,
    Capperspeed = 0,
    CapperspeedTemp = 0,
    CapperflagPrint = 0,
    CappersecStop = 0,
    CapperdeltaRejected = null,
    CapperONS = 0,
    CapperStartTime = null,
    CappertimeStop = 30, //NOTE: Timestop
    CapperWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
    CapperflagRunning = false,
    CapperRejectFlag = false,
    CapperReject,
    CntOutCapper=null,
    CntInCapper=null;
var Labellerct = null,
    Labellerresults = null,
    Labelleractual = 0,
    Labellertime = 0,
    Labellersec = 0,
    LabellerflagStopped = false,
    Labellerstate = 0,
    Labellerspeed = 0,
    LabellerspeedTemp = 0,
    LabellerflagPrint = 0,
    LabellersecStop = 0,
    LabellerdeltaRejected = null,
    LabellerONS = 0,
    LabellerStartTime = null,
    LabellertimeStop = 30, //NOTE: Timestop
    LabellerWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
    LabellerflagRunning = false,
    LabellerRejectFlag = false,
    LabellerReject,
    CntOutLabeller=null,
    CntInLabeller=null;
var Lainerct = null,
    Lainerresults = null,
    Laineractual = 0,
    Lainertime = 0,
    Lainersec = 0,
    LainerflagStopped = false,
    Lainerstate = 0,
    Lainerspeed = 0,
    LainerspeedTemp = 0,
    LainerflagPrint = 0,
    LainersecStop = 0,
    LainerdeltaRejected = null,
    LainerONS = 0,
    LainerStartTime = null,
    LainertimeStop = 30, //NOTE: Timestop
    LainerWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
    LainerflagRunning = false,
    LainerRejectFlag = false,
    LainerReject,
    CntOutLainer=null,
    CntInLainer=null;
    var XRay2ct = null,
        XRay2results = null,
        XRay2actual = 0,
        XRay2time = 0,
        XRay2sec = 0,
        XRay2flagStopped = false,
        XRay2state = 0,
        XRay2speed = 0,
        XRay2speedTemp = 0,
        XRay2flagPrint = 0,
        XRay2secStop = 0,
        XRay2deltaRejected = null,
        XRay2ONS = 0,
        XRay2StartTime = null,
        XRay2timeStop = 30, //NOTE: Timestop
        XRay2Worktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
        XRay2flagRunning = false,
        XRay2RejectFlag = false,
        XRay2Reject,
        CntOutXRay2=null,
        CntInXRay2=null;
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
  var FillerVerify = function(){
        try{
          FillerReject = fs.readFileSync('FillerRejected.json');
          if(FillerReject.toString().indexOf('}') > 0 && FillerReject.toString().indexOf('{\"rejected\":') != -1){
            FillerReject = JSON.parse(FillerReject);
          }else{
            throw 12121212;
          }
        }catch(err){
          if(err.code == 'ENOENT' || err == 12121212){
            fs.writeFileSync('FillerRejected.json','{"rejected":0}'); //NOTE: Change the object to what it usually is.
            FillerReject = {
              rejected : 0
            };
          }
        }
      };

  FillerVerify();
  var CapperVerify = function(){
        try{
          CapperReject = fs.readFileSync('CapperRejected.json');
          if(CapperReject.toString().indexOf('}') > 0 && CapperReject.toString().indexOf('{\"rejected\":') != -1){
            CapperReject = JSON.parse(CapperReject);
          }else{
            throw 12121212;
          }
        }catch(err){
          if(err.code == 'ENOENT' || err == 12121212){
            fs.writeFileSync('CapperRejected.json','{"rejected":0}'); //NOTE: Change the object to what it usually is.
            CapperReject = {
              rejected : 0
            };
          }
        }
      };

  CapperVerify();
  var LabellerVerify = function(){
        try{
          LabellerReject = fs.readFileSync('LabellerRejected.json');
          if(LabellerReject.toString().indexOf('}') > 0 && LabellerReject.toString().indexOf('{\"rejected\":') != -1){
            LabellerReject = JSON.parse(LabellerReject);
          }else{
            throw 12121212;
          }
        }catch(err){
          if(err.code == 'ENOENT' || err == 12121212){
            fs.writeFileSync('LabellerRejected.json','{"rejected":0}'); //NOTE: Change the object to what it usually is.
            LabellerReject = {
              rejected : 0
            };
          }
        }
      };

  LabellerVerify();
  var LainerVerify = function(){
        try{
          LainerReject = fs.readFileSync('LainerRejected.json');
          if(LainerReject.toString().indexOf('}') > 0 && LainerReject.toString().indexOf('{\"rejected\":') != -1){
            LainerReject = JSON.parse(LainerReject);
          }else{
            throw 12121212;
          }
        }catch(err){
          if(err.code == 'ENOENT' || err == 12121212){
            fs.writeFileSync('LainerRejected.json','{"rejected":0}'); //NOTE: Change the object to what it usually is.
            LainerReject = {
              rejected : 0
            };
          }
        }
      };

  LainerVerify();
  var XRay2Verify = function(){
        try{
          XRay2Reject = fs.readFileSync('XRay2Rejected.json');
          if(XRay2Reject.toString().indexOf('}') > 0 && XRay2Reject.toString().indexOf('{\"rejected\":') != -1){
            XRay2Reject = JSON.parse(XRay2Reject);
          }else{
            throw 12121212;
          }
        }catch(err){
          if(err.code == 'ENOENT' || err == 12121212){
            fs.writeFileSync('XRay2Rejected.json','{"rejected":0}'); //NOTE: Change the object to what it usually is.
            XRay2Reject = {
              rejected : 0
            };
          }
        }
      };

  XRay2Verify();

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
        //------------------------------------------Filler----------------------------------------------
              Fillerct = CntOutFiller; // NOTE: igualar al contador de salida
              if (FillerONS == 0 && Fillerct) {
                FillerspeedTemp = Fillerct;
                FillerStartTime = Date.now();
                FillerONS = 1;
              }
              if(Fillerct > Filleractual){
                if(FillerflagStopped){
                  Fillerspeed = Fillerct -FillerspeedTemp;
                  FillerspeedTemp = Fillerct;
                  Fillersec = 0;
                  FillerStartTime = Date.now();
                  FillerdeltaRejected = null;
                  FillerRejectFlag = false;
                }
                FillersecStop = 0;
                Fillersec++;
                Fillertime = Date.now();
                Fillerstate = 1;
                FillerflagStopped = false;
                FillerflagRunning = true;
              } else if( Fillerct == Filleractual ){
                if(FillersecStop == 0){
                  Fillertime = Date.now();
                }
                FillersecStop++;
                if(FillersecStop >= FillertimeStop){
                  Fillerspeed = 0;
                  Fillerstate = 2;
                  FillerspeedTemp = Fillerct;
                  FillerflagStopped = true;
                  FillerflagRunning = false;

                  if(CntInFiller - CntOutFiller - FillerReject.rejected != 0 && ! FillerRejectFlag){
                    FillerdeltaRejected = CntInFiller - CntOutFiller - FillerReject.rejected;
                    FillerReject.rejected = CntInFiller - CntOutFiller;
                    fs.writeFileSync('FillerRejected.json','{"rejected": ' + FillerReject.rejected + '}');
                    FillerRejectFlag = true;
                  }else{
                    FillerdeltaRejected = null;
                  }
                }
                if(FillersecStop % (FillertimeStop * 3) == 0 ||FillersecStop == FillertimeStop ){
                  FillerflagPrint=1;

                  if(FillersecStop % (FillertimeStop * 3) == 0){
                    Fillertime = Date.now();
                    FillerdeltaRejected = null;
                  }
                }
              }
              Filleractual = Fillerct;
              if(Fillersec == FillerWorktime){
                Fillersec = 0;
                if(FillerflagRunning && Fillerct){
                  FillerflagPrint = 1;
                  FillersecStop = 0;
                  Fillerspeed = Math.floor( (Fillerct - FillerspeedTemp) / (Date.now() - FillerStartTime) * 60000 );
                  FillerspeedTemp = Fillerct;
                }
              }
              Fillerresults = {
                ST: Fillerstate,
                CPQI: CntInFiller,
                CPQO: CntInFiller,//CntOutFiller,
                CPQR: FillerdeltaRejected,
                SP: Fillerspeed
              };
              if (FillerflagPrint == 1) {
                for (var key in Fillerresults) {
                  if(Fillerresults[key]!=null&&!isNaN(Fillerresults[key]))
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/MATTER1_LOGS/mex_ler_Filler_matter1.log', 'tt=' + Fillertime + ',var=' + key + ',val=' + Fillerresults[key] + '\n');
                }
                FillerflagPrint = 0;
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
        //------------------------------------------Capper----------------------------------------------
              Capperct = CntOutCapper; // NOTE: igualar al contador de salida
              if (CapperONS == 0 && Capperct) {
                CapperspeedTemp = Capperct;
                CapperStartTime = Date.now();
                CapperONS = 1;
              }
              if(Capperct > Capperactual){
                if(CapperflagStopped){
                  Capperspeed = Capperct -CapperspeedTemp;
                  CapperspeedTemp = Capperct;
                  Cappersec = 0;
                  CapperStartTime = Date.now();
                  CapperdeltaRejected = null;
                  CapperRejectFlag = false;
                }
                CappersecStop = 0;
                Cappersec++;
                Cappertime = Date.now();
                Capperstate = 1;
                CapperflagStopped = false;
                CapperflagRunning = true;
              } else if( Capperct == Capperactual ){
                if(CappersecStop == 0){
                  Cappertime = Date.now();
                }
                CappersecStop++;
                if(CappersecStop >= CappertimeStop){
                  Capperspeed = 0;
                  Capperstate = 2;
                  CapperspeedTemp = Capperct;
                  CapperflagStopped = true;
                  CapperflagRunning = false;

                  if(CntInCapper - CntOutCapper - CapperReject.rejected != 0 && ! CapperRejectFlag){
                    CapperdeltaRejected = CntInCapper - CntOutCapper - CapperReject.rejected;
                    CapperReject.rejected = CntInCapper - CntOutCapper;
                    fs.writeFileSync('CapperRejected.json','{"rejected": ' + CapperReject.rejected + '}');
                    CapperRejectFlag = true;
                  }else{
                    CapperdeltaRejected = null;
                  }
                }
                if(CappersecStop % (CappertimeStop * 3) == 0 ||CappersecStop == CappertimeStop ){
                  CapperflagPrint=1;

                  if(CappersecStop % (CappertimeStop * 3) == 0){
                    Cappertime = Date.now();
                    CapperdeltaRejected = null;
                  }
                }
              }
              Capperactual = Capperct;
              if(Cappersec == CapperWorktime){
                Cappersec = 0;
                if(CapperflagRunning && Capperct){
                  CapperflagPrint = 1;
                  CappersecStop = 0;
                  Capperspeed = Math.floor( (Capperct - CapperspeedTemp) / (Date.now() - CapperStartTime) * 60000 );
                  CapperspeedTemp = Capperct;
                }
              }
              Capperresults = {
                ST: Capperstate,
                CPQI: CntInCapper,
                CPQO: CntOutCapper,
                CPQR: CapperdeltaRejected,
                SP: Capperspeed
              };
              if (CapperflagPrint == 1) {
                for (var key in Capperresults) {
                  if(Capperresults[key]!=null&&!isNaN(Capperresults[key]))
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/MATTER1_LOGS/mex_ler_Capper_matter1.log', 'tt=' + Cappertime + ',var=' + key + ',val=' + Capperresults[key] + '\n');
                }
                CapperflagPrint = 0;
              }
        //------------------------------------------Capper----------------------------------------------

        //------------------------------------------Labeller----------------------------------------------
              Labellerct = CntOutLabeller; //NOTE: igualar al contador de salida
              if (LabellerONS == 0 && Labellerct) {
                LabellerspeedTemp = Labellerct;
                LabellerStartTime = Date.now();
                LabellerONS = 1;
              }
              if(Labellerct > Labelleractual){
                if(LabellerflagStopped){
                  Labellerspeed = Labellerct -LabellerspeedTemp;
                  LabellerspeedTemp = Labellerct;
                  Labellersec = 0;
                  LabellerStartTime = Date.now();
                  LabellerdeltaRejected = null;
                  LabellerRejectFlag = false;
                }
                LabellersecStop = 0;
                Labellersec++;
                Labellertime = Date.now();
                Labellerstate = 1;
                LabellerflagStopped = false;
                LabellerflagRunning = true;
              } else if( Labellerct == Labelleractual ){
                if(LabellersecStop == 0){
                  Labellertime = Date.now();
                }
                LabellersecStop++;
                if(LabellersecStop >= LabellertimeStop){
                  Labellerspeed = 0;
                  Labellerstate = 2;
                  LabellerspeedTemp = Labellerct;
                  LabellerflagStopped = true;
                  LabellerflagRunning = false;

                  if(CntInLabeller - CntOutLabeller - LabellerReject.rejected != 0 && ! LabellerRejectFlag){
                    LabellerdeltaRejected = CntInLabeller - CntOutLabeller - LabellerReject.rejected;
                    LabellerReject.rejected = CntInLabeller - CntOutLabeller;
                    fs.writeFileSync('LabellerRejected.json','{"rejected": ' + LabellerReject.rejected + '}');
                    LabellerRejectFlag = true;
                  }else{
                    LabellerdeltaRejected = null;
                  }
                }
                if(LabellersecStop % (LabellertimeStop * 3) == 0 ||LabellersecStop == LabellertimeStop ){
                  LabellerflagPrint=1;

                  if(LabellersecStop % (LabellertimeStop * 3) == 0){
                    Labellertime = Date.now();
                    LabellerdeltaRejected = null;
                  }
                }
              }
              Labelleractual = Labellerct;
              if(Labellersec == LabellerWorktime){
                Labellersec = 0;
                if(LabellerflagRunning && Labellerct){
                  LabellerflagPrint = 1;
                  LabellersecStop = 0;
                  Labellerspeed = Math.floor( (Labellerct - LabellerspeedTemp) / (Date.now() - LabellerStartTime) * 60000 );
                  LabellerspeedTemp = Labellerct;
                }
              }
              Labellerresults = {
                ST: Labellerstate,
                CPQI: CntInLabeller,
                CPQO: CntOutLabeller,
                CPQR: LabellerdeltaRejected,
                SP: Labellerspeed
              };
              if (LabellerflagPrint == 1) {
                for (var key in Labellerresults) {
                  if(Labellerresults[key]!=null&&!isNaN(Labellerresults[key]))
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/MATTER1_LOGS/mex_ler_Labeller_matter1.log', 'tt=' + Labellertime + ',var=' + key + ',val=' + Labellerresults[key] + '\n');
                }
                LabellerflagPrint = 0;
              }
        //------------------------------------------Labeller----------------------------------------------
        //------------------------------------------Lainer----------------------------------------------
              Lainerct = CntOutLainer; // NOTE: igualar al contador de salida
              if (LainerONS == 0 && Lainerct) {
                LainerspeedTemp = Lainerct;
                LainerStartTime = Date.now();
                LainerONS = 1;
              }
              if(Lainerct > Laineractual){
                if(LainerflagStopped){
                  Lainerspeed = Lainerct -LainerspeedTemp;
                  LainerspeedTemp = Lainerct;
                  Lainersec = 0;
                  LainerStartTime = Date.now();
                  LainerdeltaRejected = null;
                  LainerRejectFlag = false;
                }
                LainersecStop = 0;
                Lainersec++;
                Lainertime = Date.now();
                Lainerstate = 1;
                LainerflagStopped = false;
                LainerflagRunning = true;
              } else if( Lainerct == Laineractual ){
                if(LainersecStop == 0){
                  Lainertime = Date.now();
                }
                LainersecStop++;
                if(LainersecStop >= LainertimeStop){
                  Lainerspeed = 0;
                  Lainerstate = 2;
                  LainerspeedTemp = Lainerct;
                  LainerflagStopped = true;
                  LainerflagRunning = false;

                  if(CntInLainer - CntOutLainer - LainerReject.rejected != 0 && ! LainerRejectFlag){
                    LainerdeltaRejected = CntInLainer - CntOutLainer - LainerReject.rejected;
                    LainerReject.rejected = CntInLainer - CntOutLainer;
                    fs.writeFileSync('LainerRejected.json','{"rejected": ' + LainerReject.rejected + '}');
                    LainerRejectFlag = true;
                  }else{
                    LainerdeltaRejected = null;
                  }
                }
                if(LainersecStop % (LainertimeStop * 3) == 0 ||LainersecStop == LainertimeStop ){
                  LainerflagPrint=1;

                  if(LainersecStop % (LainertimeStop * 3) == 0){
                    Lainertime = Date.now();
                    LainerdeltaRejected = null;
                  }
                }
              }
              Laineractual = Lainerct;
              if(Lainersec == LainerWorktime){
                Lainersec = 0;
                if(LainerflagRunning && Lainerct){
                  LainerflagPrint = 1;
                  LainersecStop = 0;
                  Lainerspeed = Math.floor( (Lainerct - LainerspeedTemp) / (Date.now() - LainerStartTime) * 60000 );
                  LainerspeedTemp = Lainerct;
                }
              }
              Lainerresults = {
                ST: Lainerstate,
                CPQI: CntInLainer,
                CPQO: CntOutLainer,
                CPQR: LainerdeltaRejected,
                SP: Lainerspeed
              };
              if (LainerflagPrint == 1) {
                for (var key in Lainerresults) {
                  if(Lainerresults[key]!=null&&!isNaN(Lainerresults[key]))
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/MATTER1_LOGS/mex_ler_Lainer_matter1.log', 'tt=' + Lainertime + ',var=' + key + ',val=' + Lainerresults[key] + '\n');
                }
                LainerflagPrint = 0;
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
              XRay2ct = CntOutXRay2; // NOTE: igualar al contador de salida
              if (XRay2ONS == 0 && XRay2ct) {
                XRay2speedTemp = XRay2ct;
                XRay2StartTime = Date.now();
                XRay2ONS = 1;
              }
              if(XRay2ct > XRay2actual){
                if(XRay2flagStopped){
                  XRay2speed = XRay2ct -XRay2speedTemp;
                  XRay2speedTemp = XRay2ct;
                  XRay2sec = 0;
                  XRay2StartTime = Date.now();
                  XRay2deltaRejected = null;
                  XRay2RejectFlag = false;
                }
                XRay2secStop = 0;
                XRay2sec++;
                XRay2time = Date.now();
                XRay2state = 1;
                XRay2flagStopped = false;
                XRay2flagRunning = true;
              } else if( XRay2ct == XRay2actual ){
                if(XRay2secStop == 0){
                  XRay2time = Date.now();
                }
                XRay2secStop++;
                if(XRay2secStop >= XRay2timeStop){
                  XRay2speed = 0;
                  XRay2state = 2;
                  XRay2speedTemp = XRay2ct;
                  XRay2flagStopped = true;
                  XRay2flagRunning = false;

                  if(CntInXRay2 - CntOutXRay2 - XRay2Reject.rejected != 0 && ! XRay2RejectFlag){
                    XRay2deltaRejected = CntInXRay2 - CntOutXRay2 - XRay2Reject.rejected;
                    XRay2Reject.rejected = CntInXRay2 - CntOutXRay2;
                    fs.writeFileSync('XRay2Rejected.json','{"rejected": ' + XRay2Reject.rejected + '}');
                    XRay2RejectFlag = true;
                  }else{
                    XRay2deltaRejected = null;
                  }
                }
                if(XRay2secStop % (XRay2timeStop * 3) == 0 ||XRay2secStop == XRay2timeStop ){
                  XRay2flagPrint=1;

                  if(XRay2secStop % (XRay2timeStop * 3) == 0){
                    XRay2time = Date.now();
                    XRay2deltaRejected = null;
                  }
                }
              }
              XRay2actual = XRay2ct;
              if(XRay2sec == XRay2Worktime){
                XRay2sec = 0;
                if(XRay2flagRunning && XRay2ct){
                  XRay2flagPrint = 1;
                  XRay2secStop = 0;
                  XRay2speed = Math.floor( (XRay2ct - XRay2speedTemp) / (Date.now() - XRay2StartTime) * 60000 );
                  XRay2speedTemp = XRay2ct;
                }
              }
              XRay2results = {
                ST: XRay2state,
                CPQI: CntInXRay2,
                CPQO: CntOutXRay2,
                CPQR: XRay2deltaRejected,
                SP: XRay2speed
              };
              if (XRay2flagPrint == 1) {
                for (var key in XRay2results) {
                  if(XRay2results[key]!=null&&!isNaN(XRay2results[key]))
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/MATTER1_LOGS/mex_ler_XRay2_matter1.log', 'tt=' + XRay2time + ',var=' + key + ',val=' + XRay2results[key] + '\n');
                }
                XRay2flagPrint = 0;
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
