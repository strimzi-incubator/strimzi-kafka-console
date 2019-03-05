#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}
CLUSTER=${STRIMZI_CLUSTER:-my-cluster}

sed -i "s/my-cluster/$CLUSTER/" console/install/020-Deployment-strimzi-console.yaml

oc apply -f console/install -n $NAMESPACE
oc expose service/strimzi-console -n $NAMESPACE