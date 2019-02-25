#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}

oc apply -f kafka/cluster/kafka-persistent-with-metrics.yaml -n $NAMESPACE