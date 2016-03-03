var net = require('net'),
   util = require('util'),
   http = require('http');

var debug;
var elasticHost;
var elasticPort;
var elasticPath;
var lg;

exports.bulkInsert = function(index, data) {
  var optionsPost = {
    host: elasticHost,
    port: elasticPort,
    path: elasticPath + index + '/_bulk',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length
    }
  };

  var req = http.request(optionsPost, function(res) {
    res.on('data', function(d) {
      if (Math.floor(res.statusCode / 100) == 5){
        var errdata = "HTTP " + res.statusCode + ": " + d;
        lg.log('error', errdata);
      }
    });
  }).on('error', function(err) {
    lg.log('error', 'Error with HTTP request, no stats flushed.');
    console.log(err);
  });

  if (debug) {
    lg.log('ES payload:');
    lg.log(payload);
  }
  req.write(payload);
  req.end();
};


exports.init = function elasticsearch_client(configES, logger) {
  debug = configEs.debug;
  lg = logger;
  elasticHost = configEs.host || 'localhost';
  elasticPort = configEs.port || 9200;
  elasticPath = configEs.path || '/';
};
