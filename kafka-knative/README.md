# Hard Shake Demo

## Ensure the Topic exists in Strimzi

Via the Strimzi console or otherwise, ensure a `sensorstream-raw`
topic exists and has 100 partitions.

## Deploy the sensorstream-raw-service Knative Service

Provide the needed privileges and deploy the ksvc:

    oc create ns sensorstream-raw
    oc adm policy add-scc-to-user privileged -z default -n sensorstream-raw
    oc adm policy add-scc-to-user anyuid -z default -n sensorstream-raw
    
    oc apply -f sensorstream-raw-service.yaml -n sensorstream-raw
    
## Wire up a Knative KafkaSource to this Knative Service

    oc apply -f sensorstream-raw-source.yaml -n sensorstream-raw

## Verify Knative scales up

Visit
http://play-web-game-demo.apps.dev.openshift.redhatkeynote.com/generator.html
from an Android phone, click the Start button, and shake your
phone. You should see pods scaling up in the sensorstream-raw
namespace via the OpenShift CLI or web console.

# Manual testing with message dumper

## Deploy the message dumper Knative service

Providing the needed rights and the deploying the application.

    oc adm policy add-scc-to-user privileged -z default -n strimzi-demo-test
    oc adm policy add-scc-to-user anyuid -z default -n strimzi-demo-test

    oc apply -f message-dumper.yaml -n strimzi-demo-test

For testing, use the `knative-ingressgateway` address got from:

    oc get svc -n istio-system

To connect directly to the message dumper via HTTP:

    curl -H "Host: message-dumper.strimzi-demo-test.example.com" http://IP_ADDRESS:80

## Install the Knative Kafka source

    oc apply -f kafka-source.yaml -n strimzi-demo-test

