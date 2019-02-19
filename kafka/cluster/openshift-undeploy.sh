#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}

oc delete kafka my-cluster -n $NAMESPACE