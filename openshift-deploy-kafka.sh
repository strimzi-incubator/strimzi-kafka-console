#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}
CLUSTER=${STRIMZI_CLUSTER:-my-cluster}

sed -i "s/my-cluster/$CLUSTER/" kafka/cluster/kafka-persistent-with-metrics.yaml

oc apply -f kafka/cluster/kafka-persistent-with-metrics.yaml -n $NAMESPACE