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
      "lo": "127.0.0.1",
      "eth0": "10.0.1.16"
    }
    [2013-04-11T05:31:53.895Z] server started: http://0.0.0.0:8080


See the page at [http://localhost:8080][1].

`htppserver` will serve out of your current working directory.

You can pass in arguments to change the port and host, as well as environmental variables

    $ httpserver 80 localhost

or

    $ NODE_PORT=80 NODE_HOST=127.0.0.1 httpserver

example

    $ httpserver
    {
      "lo": "127.0.0.1",
      "eth0": "10.0.1.16"
    }
    [2013-04-11T05:30:13.895Z] server started: http://0.0.0.0:8080
    [2013-04-11T05:30:32.328Z] 127.0.0.1 GET 200 / (2ms)
    [2013-04-11T05:30:41.186Z] 127.0.0.1 GET 404 /fake.txt (1ms)
    [2013-04-11T05:30:49.541Z] 127.0.0.1 GET 200 /.npmignore (10ms)
    [2013-04-11T05:30:54.300Z] 127.0.0.1 GET 200 /.gitignore (3ms)

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
