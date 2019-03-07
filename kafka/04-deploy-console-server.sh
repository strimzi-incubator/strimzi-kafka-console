#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}
CLUSTER=${STRIMZI_CLUSTER:-my-cluster}

sed "s/my-cluster/$CLUSTER/" console-server/020-Deployment-strimzi-console-server.yaml > console-server/$CLUSTER-020-Deployment-strimzi-console-server.yaml

oc apply -f console-server -n $NAMESPACE

echo "Waiting for console server to be ready..."
oc rollout status deployment/strimzi-console-server -w -n $NAMESPACE
echo "...console server ready"

rm console-server/$CLUSTER-020-Deployment-strimzi-console-server.yaml