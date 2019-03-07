#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}
CLUSTER=${STRIMZI_CLUSTER:-my-cluster}

sed -i "s/my-cluster/$CLUSTER/" console-server/install/020-Deployment-strimzi-console-server.yaml

oc apply -f console-server/install -n $NAMESPACE

echo "Waiting for console server to be ready..."
oc rollout status deployment/strimzi-console-server -w -n $NAMESPACE
echo "...console server ready"