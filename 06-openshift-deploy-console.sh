#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}
CLUSTER=${STRIMZI_CLUSTER:-my-cluster}

sed -i "s/namespace: .*/namespace: $NAMESPACE/" console/install/*RoleBinding*.yaml
sed -i "s/my-cluster/$CLUSTER/" console/install/050-Deployment-strimzi-console-server.yaml

oc apply -f console/install -n $NAMESPACE