#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}

oc apply -f kafka-persistent.yaml -n $NAMESPACE