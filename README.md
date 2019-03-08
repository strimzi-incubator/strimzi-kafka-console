Create the namespace/project where the Cluster Operator, the related Kafka cluser and the Console Server have to be deployed.

    oc create namespace <my-namespace>

All the deploy scripts install all the resources in the `strimzi` namespace/project by default.
It's possible to change the destination namespace/project setting the `STRIMZI_NAMESPACE` env var before running the scripts.

    export STRIMZI_NAMESPACE=<my-namespace>

The default name for the Kafka cluster is `ḿy-cluster`.
It's possible to change this name setting the `STRIMZI_CLUSTER` env var before running the scripts.

    export STRIMZI_CLUSTER=<my-cluster-name>

Finally move to the `kafka` folder.

    cd kafka

> WARNING: the following steps refers to the scripts moved to the [cluster setup](https://github.com/rhdemo/2019-demo4-cluster-setup) repo.

## Deploy Strimzi Cluster Operator

In order to install the Cluster Operator, the logged user needs to have **admin rights** on the OpenShift cluster due to the CRDs (Custom Resource Definitions) which is installed.

    ./01-openshift-deploy-strimzi.sh

## Deploy the Kafka cluster

The Kafka cluster is deployed just creating a new `Kafka` resource running the following script.

    ./02-openshift-deploy-kafka.sh

## Deploy the Kafka topics

The Kafka topics are created via `KafkaTopic` resources running the following script.

    ./03-openshift-deploy-topics.sh

## Deploy the Console Server and the Web Console

The Console Server exposes an HTTP REST API for the Web UI for handling topics in the cluster.
It has to be deployed in the same namespece (env var `STRIMZI_NAMESPACE`) as the Cluster Operator and the Kafka cluster.

    ./04-openshift-deploy-console-server.sh

Related to the Console Server, there is the Web Console application.

    ./05-openshift-deploy-console.sh

## Deploy Prometheus and Grafana for monitoring

In order to monitor the Kafka cluster and the Zookeeper nodes, Prometheus and Grafana can be installed running the following script.

    ./06-openshift-deploy-monitoring.sh

The script push Kafka and Zookeeper dashboards to Grafan through the API as well.

## Undeploy the Kafka cluster

The undeploy script just deletes the `Kafka` resource so that the Cluster Operator takes care of that deleting the Kafka cluster.

    ./10-openshift-undeploy-kafka.sh

## Undeploy Strimzi Cluster Operator and Console Server

The undeploy script removes the Cluster Operator and Console Server deployments as well as all the related installed resources like service account, cluster roles, cluster role bindings and so on.

    ./20-openshift-undeploy.sh
