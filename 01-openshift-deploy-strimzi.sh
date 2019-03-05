#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}

sed -i "s/namespace: .*/namespace: $NAMESPACE/" kafka/strimzi/install/cluster-operator/*RoleBinding*.yaml

oc apply -f kafka/strimzi/install/cluster-operator -n $NAMESPACE
oc apply -f kafka/strimzi/install/strimzi-admin -n $NAMESPACE