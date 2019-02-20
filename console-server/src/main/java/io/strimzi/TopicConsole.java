/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
package io.strimzi;

import io.fabric8.kubernetes.client.KubernetesClient;

public class TopicConsole {

    private final String kafkaBootstrapServers;
    private final KubernetesClient kubeClient;

    public TopicConsole(KubernetesClient kubeClient, String kafkaBootstrapServers) {
        this.kubeClient = kubeClient;
        this.kafkaBootstrapServers = kafkaBootstrapServers;
    }
}