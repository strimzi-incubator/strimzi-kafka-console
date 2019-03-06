#!/bin/bash

./01-openshift-deploy-strimzi.sh
./02-openshift-deploy-kafka.sh
./03-openshift-deploy-topics.sh
./04-openshift-deploy-console-server.sh
./05-openshift-deploy-console.sh
./06-openshift-deploy-monitoring.sh