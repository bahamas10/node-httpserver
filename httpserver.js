#!/usr/bin/env node
/**
 * Simple HTTP Server
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: 4/10/2013
 * License: MIT
 */

var http = require('http');
var os = require('os');

var accesslog = require('access-log');
var getopt = require('posix-getopt');

var package = require('./package.json');

function usage() {
  return [
    'usage: httpserver [options] [port] [host]',
    '',
    'command line HTTP server tool for serving up local files, similar to python -mSimpleHTTPServer',
    '',
    'options',
    '  -d, --no-index            disable reading of index.html/index.htm if found, env HTTPSERVER_NO_INDEX',
    '  -h, --help                print this message and exit',
    '  -H, --host <host>         the host address on which to listen, env HTTPSERVER_HOST defaults to ' + (opts.host || '0.0.0.0'),
    '  -n, --no-dir-listing      return 403 for directory requests instead of a directory listing, env HTTPSERVER_NO_DIR_LISTING',
    '  -p, --port <port>         the port on which to listen, env HTTPSERVER_PORT, defaults to ' + (opts.port || 8080),
    '  -u, --updates             check for available updates on npm',
    '  -v, --version             print the version number and exit'
  ].join('\n');
}

// command line arguments
var options = [
  'd(disable-index)',
  'h(help)',
  'H:(host)',
  'n(no-indexes)',
  'p:(port)',
  'u(updates)',
  'v(version)'
].join('');
var parser = new getopt.BasicParser(options, process.argv);

var opts = {
  disableindex: process.env.HTTPSERVER_NO_INDEX,
  host: process.env.HTTPSERVER_HOST || process.env.NODE_HOST,
  nodir: process.env.HTTPSERVER_NO_DIR_LISTING,
  port: process.env.HTTPSERVER_PORT || process.env.NODE_PORT,
};
var option;
while ((option = parser.getopt()) !== undefined) {
  switch (option.option) {
    case 'd': opts.disableindex = true; break;
    case 'h': console.log(usage()); process.exit(0);
    case 'H': opts.host = option.optarg; break;
    case 'n': opts.nodir = true; break;
    case 'p': opts.port = option.optarg; break;
    case 'u': // check for updates
      require('latest').checkupdate(package, function(ret, msg) {
        console.log(msg);
        process.exit(ret);
      });
      return;
    case 'v': console.log(package.version); process.exit(0);
    default: console.error(usage()); process.exit(1); break;
  }
}
var args = process.argv.slice(parser.optind());

var staticroute = require('static-route')(
  {
    autoindex: !opts.nodir,
    logger: function() {},
    tryfiles: opts.disableindex ? [] : ['index.html', 'index.htm']
  }
);

opts.host = args[1] || opts.host || '0.0.0.0';
opts.port = args[0] || opts.port || 8080;

// print all ipv4 addresses
var ipv4 = getipv4addresses();
Object.keys(ipv4).forEach(function(iface) {
  console.log('%s: %s', iface, ipv4[iface]);
});

// start the server
http.createServer(onrequest).listen(opts.port, opts.host, listening);

function listening() {
  console.log('server started: http://%s:%d', opts.host, opts.port);
}

function onrequest(req, res) {
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
