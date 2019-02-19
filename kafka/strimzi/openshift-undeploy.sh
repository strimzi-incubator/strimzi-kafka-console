#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}

# deleting "all" Strimzi resources (actually just the CO deployment)
oc delete all -l app=strimzi -n $NAMESPACE

# deleting CRDs, service account, cluster roles, cluster role bindings, 
oc delete crd -l app=strimzi
oc delete serviceaccount -l app=strimzi -n $NAMESPACE
oc delete clusterrole -l app=strimzi
oc delete clusterrolebinding -l app=strimzi
oc delete rolebinding -l app=strimzi -n $NAMESPACE

# finally deletes the namespace
oc delete namespace $NAMESPACE