#!/bin/bash

NAMESPACE=${STRIMZI_NAMESPACE:-strimzi}
CLUSTER=${STRIMZI_CLUSTER:-my-cluster}

sed -i "s/my-cluster/$CLUSTER/" kafka/cluster/kafka-persistent-with-metrics.yaml

oc apply -f kafka/cluster/kafka-persistent-with-metrics.yaml -n $NAMESPACE

# delay for allowing cluster operator to create the first Zookeeper statefulset
sleep 5

zkReplicas=$(oc get kafka $CLUSTER -o jsonpath="{.spec.zookeeper.replicas}")
echo "Waiting for Zookeeper cluster to be ready..."
readyReplicas="0"
while [ "$readyReplicas" != "$zkReplicas" ]
do
    readyReplicas=$(oc get statefulsets $CLUSTER-zookeeper -o jsonpath="{.status.readyReplicas}")
    sleep 2
done
echo "...Zookeeper cluster ready"

kReplicas=$(oc get kafka $CLUSTER -o jsonpath="{.spec.kafka.replicas}")
echo "Waiting for Kafka cluster to be ready..."
readyReplicas="0"
while [ "$readyReplicas" != "$kReplicas" ]
do
    readyReplicas=$(oc get statefulsets $CLUSTER-kafka -o jsonpath="{.status.readyReplicas}")
    sleep 2
done
echo "...Kafka cluster ready"

echo "Waiting for entity operator to be ready..."
oc rollout status deployment/$CLUSTER-entity-operator -w
echo "...entity operator ready"