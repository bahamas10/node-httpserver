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
var path = require('path');
var url = require('url');

var accesslog = require('access-log');
var easyreq = require('easyreq');
var mime = require('mime');

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

  var file = path.join(process.cwd(), decodeURI(req.urlparsed.pathname));

  // the user wants some actual data
  fs.stat(file, function(err, stats) {
    if (err) {
      console.error(err.message);
      res.notfound();
      return;
    }

    if (stats.isDirectory()) {
      // dir
      fs.readdir(file, function(e, ret) {
        if (e) {
          console.error(e.message);
          res.error();
          return;
        }
        ret.sort();
        ret = ['.', '..'].concat(ret);
        if (req.urlparsed.query.hasOwnProperty('json')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(ret));
        } else {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.write('<ul>\n');
          ret.forEach(function(name) {
            res.write('<li>' + name.link(path.join(req.urlparsed.pathname, name)) + '</li>\n');
          });
          res.write('</ul>');
          res.end();
        }
      });
    } else {
      // file
      var etag = '"' + stats.size + '-' + Date.parse(stats.mtime) + '"';
      res.setHeader('Last-Modified', stats.mtime);

      // check cache
      if (req.headers['if-none-match'] === etag) {
        res.statusCode = 304;
        res.end();
      } else {
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Content-Type', mime.lookup(file));
        res.setHeader('ETag', etag);
        if (req.method === 'HEAD') {
          res.end();
        } else {
          var rs = fs.createReadStream(file);
          rs.pipe(res);
          res.on('close', rs.destroy.bind(rs));
        }
      }
    }
  });
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
