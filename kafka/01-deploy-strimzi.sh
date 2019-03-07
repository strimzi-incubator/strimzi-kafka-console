#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}

sed -i "s/namespace: .*/namespace: $NAMESPACE/" strimzi/install/cluster-operator/*RoleBinding*.yaml

oc apply -f strimzi/install/cluster-operator -n $NAMESPACE
oc apply -f strimzi/install/strimzi-admin -n $NAMESPACE

echo "Waiting for cluster operator to be ready..."
oc rollout status deployment/strimzi-cluster-operator -w -n $NAMESPACE
echo "...cluster operator ready"