#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}

sed -i "s/namespace: .*/namespace: $NAMESPACE/" console-server/install/*RoleBinding*.yaml

oc apply -f console-server/install -n $NAMESPACE