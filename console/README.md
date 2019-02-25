# Strimzi console

A patternfly based GUI for monitoring and maintaining strimzi topics. The console
can be accessed on port 8888.

For development purposes, it can be run outside of the local openshift
cluster and will connect to the console_server service on port 8080

## Prerequisites

- nodejs installed
- a running strimzi instance 

## Initialization


`cd console`

`npm install`

`cd www`

`npm install`


## Running the console

### Setup port forwarding

Get the list of running pods:

`oc get pods`

You will see a list of pods like:

```
NAME                                          READY     STATUS    RESTARTS   AGE
my-cluster-entity-operator-86f8749d65-dg58p   3/3       Running   0          1d
my-cluster-kafka-0                            2/2       Running   0          1d
my-cluster-kafka-1                            2/2       Running   0          1d
my-cluster-kafka-2                            2/2       Running   1          1d
my-cluster-zookeeper-0                        2/2       Running   0          1d
my-cluster-zookeeper-1                        2/2       Running   0          1d
my-cluster-zookeeper-2                        2/2       Running   0          1d
strimzi-cluster-operator-ffb85f7c6-jxn6s      1/1       Running   6          1d
strimzi-console-server-7749b66948-tffz2       1/1       Running   0          1d
```

Run the Openshift port forward command for the console-server

`oc port-forward strimzi-console-server-7749b66948-tffz2 8080:8080`

### Start the nodejs application that serves the console pages

From the console directory:

`node bin/console.js`

### Open the console in a browser

`localhost:8888`

