## Deploy Strimzi Cluster Operator

In order to install the Cluster Operator, the logged user needs to have admin rights on the OpenShift cluster.

Create the namespace/project where the Cluster Operator and the related Kafka cluser has to be deployed.

    oc create namespace <my-namespace>

The deploy script install the Cluster Operator with all related resources like service account, cluster roles cluster role bindings and so on in the `strimzi` namespace/project by default.
It's possible to change the destination namespace/project setting the `STRIMZI_NAMESPACE` env var before running the script.

    ./strimzi/openshift-deploy.sh

## Deploy the Kafka cluster

The Kafka cluster is deployed just creating a new `Kafka` resource running the following script.
It's possible to change the destination namespace/project setting the `STRIMZI_NAMESPACE` env var before running the script.

    ./cluster/openshift-deploy.sh

## Deploy the Console Server

The Console Server exposes an HTTP REST API for the Web UI for handling topics in the cluster.
It has to be deployed in the same namespece (env var `STRIMZI_NAMESPACE`) as the Cluster Operator and the Kafka cluster.

    openshift-deploy.sh

## Undeploy the Kafka cluster

The undeploy script just deletes the `Kafka` resource so that the Cluster Operator takes care of that deleting the Kafka cluster.

    ./cluster/openshift-undeploy.sh

## Undeploy Strimzi Cluster Operator and Console Server

The undeploy script remove the Cluster Operator deployment as well as all the related installed resources like service account, cluster roles, cluster role bindings and so on.

    ./strimzi/openshift-undeploy.sh