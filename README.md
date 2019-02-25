Create the namespace/project where the Cluster Operator, the related Kafka cluser and the Console Server have to be deployed.

    oc create namespace <my-namespace>

All the deploy scripts install all the resources in the `strimzi` namespace/project by default.
It's possible to change the destination namespace/project setting the `STRIMZI_NAMESPACE` env var before running the scripts.

    export STRIMZI_NAMESPACE=<my-namespace>

## Deploy Strimzi Cluster Operator

In order to install the Cluster Operator, the logged user needs to have **admin rights** on the OpenShift cluster due to the CRDs (Custom Resource Definitions) which is installed.

    ./openshift-deploy-strimzi.sh

## Deploy the Kafka cluster

The Kafka cluster is deployed just creating a new `Kafka` resource running the following script.

    ./openshift-deploy-kafka.sh

## Deploy the Console Server

The Console Server exposes an HTTP REST API for the Web UI for handling topics in the cluster.
It has to be deployed in the same namespece (env var `STRIMZI_NAMESPACE`) as the Cluster Operator and the Kafka cluster.

    ./openshift-deploy-console-server.sh

## Undeploy the Kafka cluster

The undeploy script just deletes the `Kafka` resource so that the Cluster Operator takes care of that deleting the Kafka cluster.

    ./openshift-undeploy-kafka.sh

## Undeploy Strimzi Cluster Operator and Console Server

The undeploy script removes the Cluster Operator and Console Server deployments as well as all the related installed resources like service account, cluster roles, cluster role bindings and so on.

    ./openshift-undeploy.sh