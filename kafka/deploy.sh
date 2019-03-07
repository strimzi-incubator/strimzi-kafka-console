#!/bin/bash

# download Strimzi release
wget https://github.com/strimzi/strimzi-kafka-operator/releases/download/0.11.1/strimzi-0.11.1.tar.gz
mkdir strimzi
tar xzf strimzi-0.11.1.tar.gz -C strimzi --strip 1
rm strimzi-0.11.1.tar.gz

# cluster deployment
./01-deploy-strimzi.sh
./02-deploy-kafka.sh
./03-deploy-topics.sh
./04-deploy-console-server.sh
./05-deploy-console.sh
./06-deploy-monitoring.sh

rm -rf strimzi