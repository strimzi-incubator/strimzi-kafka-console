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
oc expose service/grafana -n $NAMESPACE

# get Grafana route host for subsequent cURL calls for POSTing datasource and dashboards
GRAFANA_HOST_ROUTE=$(oc get routes grafana -o=jsonpath='{.status.ingress[0].host}{"\n"}')

# wait for the Grafana deployment to be ready for getting cURL calls
oc wait deployment/grafana --for condition=available

# POST Prometheus datasource configuration to Grafana
curl -X POST http://admin:admin@${GRAFANA_HOST_ROUTE}/api/datasources -d @kafka/monitoring/dashboards/datasource.json --header "Content-Type: application/json"

# build and POST the Kafka dashboard to Grafana
./kafka/monitoring/dashboards/dashboard-template.sh kafka/monitoring/dashboards/strimzi-kafka.json > kafka/monitoring/dashboards/strimzi-kafka-dashboard.json

sed -i 's/${DS_PROMETHEUS}/Prometheus/' kafka/monitoring/dashboards/strimzi-kafka-dashboard.json
sed -i 's/DS_PROMETHEUS/Prometheus/' kafka/monitoring/dashboards/strimzi-kafka-dashboard.json

curl -X POST http://admin:admin@${GRAFANA_HOST_ROUTE}/api/dashboards/db -d @kafka/monitoring/dashboards/strimzi-kafka-dashboard.json --header "Content-Type: application/json"

# build and POST the Zookeeper dashboard to Grafana
./kafka/monitoring/dashboards/dashboard-template.sh kafka/monitoring/dashboards/strimzi-zookeeper.json > kafka/monitoring/dashboards/strimzi-zookeeper-dashboard.json

sed -i 's/${DS_PROMETHEUS}/Prometheus/' kafka/monitoring/dashboards/strimzi-zookeeper-dashboard.json
sed -i 's/DS_PROMETHEUS/Prometheus/' kafka/monitoring/dashboards/strimzi-zookeeper-dashboard.json

curl -X POST http://admin:admin@${GRAFANA_HOST_ROUTE}/api/dashboards/db -d @kafka/monitoring/dashboards/strimzi-zookeeper-dashboard.json --header "Content-Type: application/json"

rm kafka/monitoring/dashboards/strimzi-kafka-dashboard.json
rm kafka/monitoring/dashboards/strimzi-zookeeper-dashboard.json