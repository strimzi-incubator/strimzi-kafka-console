#!/usr/bin/env bash

echo "starting console-pages server"
echo "listening on $LISTEN_PORT for http page requests"
echo "connecting to $REST_PORT for REST calls"
echo ""
node ./bin/console.js
