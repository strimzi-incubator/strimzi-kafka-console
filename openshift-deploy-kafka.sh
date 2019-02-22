#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}

oc apply -f kafka/cluster/kafka-persistent.yaml -n $NAMESPACE