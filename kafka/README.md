## Deploy Strimzi Cluster Operator

In order to install the Cluster Operator, the logged user needs to have admin rights on the OpenShift cluster.

Create the namespace/project where the Cluster Operator and the related Kafka cluser has to be deployed.

    oc create namespace <my-namespace>

The deploy script install the Cluster Operator with all related resources like service account, cluster roles cluster role bindings and so on in the `strimzi` namespace/project by default.
It's possible to change the destination namespace/project setting the `STRIMZI_NAMESPACE` env var before running the script.

    openshift-deploy.sh

## Undeploy Strimzi Cluster Operator

The undeploy script remove the Cluster Operator deployment as well as all the related installed resources like service account, cluster roles, cluster role bindings and so on.

    openshift-undeploy.sh