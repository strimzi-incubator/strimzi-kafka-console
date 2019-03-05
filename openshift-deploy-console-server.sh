#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}
CLUSTER=${STRIMZI_CLUSTER:-my-cluster}

sed -i "s/namespace: .*/namespace: $NAMESPACE/" console-server/install/*RoleBinding*.yaml
sed -i "s/my-cluster/$CLUSTER/" console-server/install/040-Deployment-strimzi-console-server.yaml

oc apply -f console-server/install -n $NAMESPACE