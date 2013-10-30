httpserver
==========

command line HTTP server tool for serving up local files, similar to `python -mSimpleHTTPServer`

Installation
------------

First, install [Node.js][0].  Then:

    npm install -g httpserver

Usage
-----

run `httpserver` on the command line to fire up a server on `0.0.0.0` port `8080`.

    $ httpserver
    {
      "lo0": "127.0.0.1",
      "en1": "10.0.1.204"
    }
    server started: http://0.0.0.0:8080


See the page at [http://localhost:8080][1].

`htppserver` will serve out of your current working directory.

You can pass in arguments to change the port and host, as well as environmental variables

    $ httpserver 80 localhost

or

    $ NODE_PORT=80 NODE_HOST=127.0.0.1 httpserver

example

    $ httpserver
    {
      "lo0": "127.0.0.1",
      "en1": "10.0.1.204"
    }
    server started: http://0.0.0.0:8080
    127.0.0.1 - - [30/Oct/2013:18:24:38 -0400] "GET / HTTP/1.1" 200 - "-" "curl/7.30.0"
    127.0.0.1 - - [30/Oct/2013:18:24:41 -0400] "GET /test/ HTTP/1.1" 404 - "-" "curl/7.30.0"

Why?
----

There are a lot of packages in npm that do the same thing.  I wanted something that
closely mimicked Python's `python -m SimpleHTTPServer` with the following conditions.

- Easy - You shouldn't have to provide arguments to get something easy up and running.  The IP addresses
on the machine are also printed for you
- Configurable - Command line options and environmental variables can modify behavior at runtime
- Safe - All other packages I found online were susceptible to directory traversal. This isn't
- Simple - All code is in one file
- Parsable - GET requests to directories are returned as directory listings, add `?json` for JSON
- Proper HTTP - Proper Mime types (using the Mime module) and Caching headers are returned

License
-------

MIT

[0]: http://nodejs.org
[1]: http://localhost:8080
