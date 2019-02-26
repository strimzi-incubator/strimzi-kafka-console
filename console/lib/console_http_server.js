/*
 * Copyright 2019 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var log = require("./log.js").logger();
var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');

function ConsoleServer() {
    // initialized once this.listen is called
    this.server = null;
}

ConsoleServer.prototype.close = function () {
    var self = this;
    return new Promise(function (resolve) {
        self.server.close(resolve);
    });
}

var content_types = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.svg': 'application/image/svg+xml'
};

function get_content_type(file) {
    return content_types[path.extname(file).toLowerCase()];
}

function static_handler(request, response) {
    var file = path.join(__dirname, '../www/', url.parse(request.url).pathname);
    if (file.charAt(file.length - 1) === '/') {
        file += 'index.html';
    }

    fs.readFile(file, function (error, data) {
        if (error) {
            response.statusCode = error.code === 'ENOENT' ? 404 : 500;
            response.end(http.STATUS_CODES[response.statusCode]);
            log.warn('GET %s => %i %j', request.url, response.statusCode, error);
        } else {
            var content_type = get_content_type(file);
            if (content_type) {
                response.setHeader('content-type', content_type);
            }
            log.debug('GET %s => %s', request.url, file);
            response.end(data);
        }
    });
}

var handleRequest = function (request, response) {
    // if we get a /topics[/<name>] request, we want to pass it along to
    // the back-end server and return the response to the web page
    let pathName = url.parse(request.url).pathname;
    let parts = pathName.split('/');
    // handle /topics and /topics/foo, but not /topicsfoo
    if (parts.length > 1 && parts[1] === 'topics') {
        var body = '';
        // Accumulate the data to be sent
        request.on('data', function (data) {
            body += data;
            if (body.length > 1e7) {
                response.writeHead(413, 'Request Entity Too Large', { 'Content-Type': 'text/html' });
                response.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
            }
        });
        // After we have received all the data for this request,
        // send it on to the back-end server
        request.on('end', function () {
            console.log(`sending / topics ${request.method} request`);
            var options = {
                host: process.env.host || 'localhost',
                port: process.env.port || 8080,
                path: pathName,
                method: request.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(body)
                }
            };
            // setup the request to the back-end server
            var req = http.request(options, function (res) {
                res.setEncoding('utf8');
                let chunks = '';
                // accumulate the response data
                res.on('data', function (chunk) {
                    chunks += chunk;
                    if (chunks.length > 1e7) {
                        response.writeHead(413, 'Response Entity Too Large', { 'Content-Type': 'text/html' });
                        response.end('<!doctype html><html><head><title>413</title></head><body>413: Response Entity Too Large</body></html>');
                    }
                });
                // once the response from the back-end server is here
                res.on('end', function () {
                    console.log(`received / topics ${request.method} response.statusCode: ${res.statusCode}`);
                    // inform the calling web page that we are done
                    response.statusCode = res.statusCode;
                    response.end(chunks);
                })
                res.on('error', function (e) {
                    console.log(`received / topics ${request.method} response.statusCode: ${res.statusCode} error: ${e}`);
                    response.statusCode = res.statusCode;
                    response.end(e);
                })
            });
            // actually send the request to the back-end server
            req.write(body);
            req.end();
        })
    } else {
        static_handler(request, response);
    }
}

ConsoleServer.prototype.listen = function (env) {
    var self = this;
    this.server = http.createServer();
    this.server.listen(env.port === undefined ? 8888 : env.port);
    this.server.on("request", handleRequest);
    return this.server;
};


module.exports = ConsoleServer;
