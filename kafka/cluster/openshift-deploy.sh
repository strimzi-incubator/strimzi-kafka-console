#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}

oc apply -f cluster/kafka-persistent.yaml -n $NAMESPACE