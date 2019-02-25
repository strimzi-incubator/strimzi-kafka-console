#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}

# Prometheus
cat kafka/monitoring/prometheus.yaml | sed -e "s/namespace: .*/namespace: $NAMESPACE/;s/regex: myproject/regex: $NAMESPACE/" > kafka/monitoring/prometheus-deploy.yaml

oc apply -f kafka/monitoring/alerting-rules.yaml -n $NAMESPACE
oc apply -f kafka/monitoring/prometheus-deploy.yaml -n $NAMESPACE
rm kafka/monitoring/prometheus-deploy.yaml
oc apply -f kafka/monitoring/alertmanager.yaml -n $NAMESPACE

# Grafana
oc apply -f kafka/monitoring/grafana.yaml -n $NAMESPACE