var Service = require('node-windows').Service


var svc = new Service({
  name:'PULSE matter1 SERVICE',
  description: 'Control of the PULSE code',
  script: __dirname + '\\mex_ler_knorr_matter1_wise.js',
  env: {
    name: "HOME",
    value: process.env["USERPROFILE"]
  }
})


svc.on('install',function(){
  svc.start()
})

svc.install()
