#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}
CLUSTER=${STRIMZI_CLUSTER:-my-cluster}

sed "s/my-cluster/$CLUSTER/" cluster/kafka-topics.yaml > cluster/$CLUSTER-kafka-topics.yaml

oc apply -f cluster/$CLUSTER-kafka-topics.yaml -n $NAMESPACE

rm cluster/$CLUSTER-kafka-topics.yaml