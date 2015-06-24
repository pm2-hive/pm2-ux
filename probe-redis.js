var pmx     = require('pmx');
var pm2     = require('pm2');
var fs      = require('fs');
var path    = require('path');
var shelljs = require('shelljs');

var conf = pmx.initModule({

  pid              : pmx.getPID('/var/run/redis/redis-server.pid'),

  widget : {
    type             : 'generic',
    logo             : 'http://redis.io/images/redis-white.png',

    // 0 = main element
    // 1 = secondary
    // 2 = main border
    // 3 = secondary border
    theme            : ['#9F1414', '#591313', 'white', 'white'],

    el : {
      probes  : false,
      actions : false
    },

    block : {
      actions : false,
      issues  : true,
      main_probes : ['Processes']
    }

    // Status
    // Green / Yellow / Red
  }
});

var probe = pmx.probe();

var pm2_procs = 0;

pm2.connect(function() {

  setInterval(function() {
    pm2.list(function(err, procs) {
      pm2_procs = procs.length;
    });
  }, 2000);

  var metric = probe.metric({
    name  : 'Processes',
    value : function() {
      return pm2_procs;
    }
  });
});

pmx.action('flush pm2 logs', { comment : 'Flush logs' } , function(reply) {
  var child = shelljs.exec('pm2 flush');
  return reply(child);
});


pmx.action('throw error', { comment : 'Flush logs' } , function(reply) {
  pmx.notify(new Error('Failure'));
  return reply({success:true});
});

pmx.action('df', { comment : 'Flush logs' } , function(reply) {
  var child = shelljs.exec('df');
  return reply(child);
});

var Probe = pmx.probe();
