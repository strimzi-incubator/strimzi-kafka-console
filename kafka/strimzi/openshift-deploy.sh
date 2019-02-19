#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}

sed -i "s/namespace: .*/namespace: $NAMESPACE/" strimzi/install/cluster-operator/*RoleBinding*.yaml

oc apply -f strimzi/install/cluster-operator -n $NAMESPACE