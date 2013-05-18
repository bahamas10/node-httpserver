#!/usr/bin/env node
/**
 * Simple HTTP Server
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: 4/10/2013
 * License: MIT
 */

var fs = require('fs');
var http = require('http');
var os = require('os');

var accesslog = require('access-log');
var easyreq = require('easyreq');
var staticroute = require('static-route')({autoindex: true, logger: function() {}});

var host = process.argv[3] || process.env.NODE_HOST || '0.0.0.0';
var port = +process.argv[2] || +process.env.NODE_PORT || 8080;

// print all ipv4 addresses
console.log(JSON.stringify(getipv4addresses(), null, 2));

// start the server
http.createServer(onrequest).listen(port, host, listening);

function listening() {
  require('log-timestamp');
  console.log('server started: http://%s:%d', host, port);
}

function onrequest(req, res) {
  easyreq(req, res);
  accesslog(req, res);
  staticroute(req, res);
}

// get all ipv4 addresses
function getipv4addresses() {
  var i = os.networkInterfaces();
  var ret = {};
  Object.keys(i).forEach(function(name) {
    var ip4 = null;
    i[name].forEach(function(int) {
      if (int.family === 'IPv4') {
        ip4 = int.address;
        return;
      }
    });
    ret[name] = ip4;
  });
  return ret;
}
