#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}

sed -i "s/namespace: .*/namespace: $NAMESPACE/" install/*RoleBinding*.yaml

oc apply -f install -n $NAMESPACE