# Deploy the message dumper Knative service

Providing the needed rights and the deploying the application.

    oc adm policy add-scc-to-user privileged -z default -n strimzi-demo-test
    oc adm policy add-scc-to-user anyuid -z default -n strimzi-demo-test

    oc apply -f message-dumper.yaml

For testing, use the `knative-ingressgateway` address got from:

    oc get svc -n istio-system

To connect directly to the message dumper via HTTP:

    curl -H "Host: message-dumper.strimzi-demo-test.example.com" http://IP_ADDRESS:80

# Install the Knative Kafka source

    oc apply -f kafka-source.yaml

