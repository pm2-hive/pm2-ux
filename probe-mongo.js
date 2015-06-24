
var pmx     = require('pmx');
var pm2     = require('pm2');
var fs      = require('fs');
var path    = require('path');
var shelljs = require('shelljs');

var conf = pmx.initModule({

  pid              : pmx.resolvePidPaths(['/var/lib/mongodb/mongod.lock']),

  widget : {
    type             : 'generic',
    logo             : 'https://www.mongodb.org/static/images/mongodb-logo.png',


    // 0 = main element
    // 1 = secondary
    // 2 = main border
    // 3 = secondary border
    theme            : ['#3b291f', '#241812', '#787878', '#787878'],

    el : {
      probes  : false,
      actions : false
    },

    block : {
      actions : true,
      issues  : true,
      main_probes : ['req/s', 'hits', 'documents', 'avg', 'shards']
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

  probe.metric({
    name  : 'shards',
    value : function() {
      return pm2_procs;
    }
  });

  probe.metric({
    name  : 'req/s',
    value : function() {
      return 20;
    }
  });

  probe.metric({
    name  : 'hits',
    value : function() {
      return Math.floor(Math.random() * 100);
    }
  });

  probe.metric({
    name  : 'documents',
    value : function() {
      return Math.floor(Math.random() * 100);
    }
  });

  probe.metric({
    name  : 'avg',
    value : function() {
      return Math.floor(Math.random() * 100);
    }
  });
});

pmx.action('flush pm2 logs', { comment : 'Flush logs' } , function(reply) {
  var child = shelljs.exec('pm2 flush');
  return reply(child);
});

pmx.action('df', { comment : 'Flush logs' } , function(reply) {
  var child = shelljs.exec('df');
  return reply(child);
});

var Probe = pmx.probe();
