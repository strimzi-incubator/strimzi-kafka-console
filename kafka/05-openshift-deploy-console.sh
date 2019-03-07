#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}
CLUSTER=${STRIMZI_CLUSTER:-my-cluster}

sed -i "s/my-cluster/$CLUSTER/" console/020-Deployment-strimzi-console.yaml

oc apply -f console -n $NAMESPACE
oc expose service/strimzi-console -n $NAMESPACE

echo "Waiting for console to be ready..."
oc rollout status deployment/strimzi-console -w -n $NAMESPACE
echo "...console ready"