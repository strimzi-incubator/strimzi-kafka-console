/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
package io.strimzi;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.strimzi.api.kafka.Crds;
import io.strimzi.api.kafka.model.KafkaTopic;
import io.strimzi.api.kafka.model.KafkaTopicBuilder;
import io.vertx.core.Future;
import io.vertx.core.Vertx;

public class TopicConsole {

    private final Vertx vertx;
    private final KubernetesClient kubeClient;

    private final String namespace;
    private final String kafkaBootstrapServers;
    
    public TopicConsole(Vertx vertx, KubernetesClient kubeClient, String namespace, String kafkaBootstrapServers) {
        this.vertx = vertx;
        this.kubeClient = kubeClient;
        this.namespace = namespace;
        this.kafkaBootstrapServers = kafkaBootstrapServers;
    }

    public Future<Void> deleteTopic(String topicName) {

        Future<Void> blockingFuture = Future.future();

        this.vertx.createSharedWorkerExecutor("kubernetes-ops-pool").executeBlocking(
            future -> {
                Crds.topicOperation(this.kubeClient).inNamespace(this.namespace).withName(topicName).delete();
                future.complete();
            }, res -> {
                if (res.succeeded()) {
                    blockingFuture.complete();
                } else {
                    blockingFuture.fail(res.cause());
                }
            });   
            
        return blockingFuture;
    }

    public Future<Void> createTopic(Topic topic) {

        KafkaTopic kafkaTopic = new KafkaTopicBuilder()
                                    .withNewMetadata()
                                        .withName(topic.getName())
                                        // TODO: make it configurable
                                        .addToLabels("strimzi.io/cluster", "my-cluster")
                                    .endMetadata()
                                    .withNewSpec()
                                        .withTopicName(topic.getName())
                                        .withPartitions(topic.getPartitions())
                                        .withReplicas(topic.getReplicas())
                                        .withConfig(topic.getConfig())
                                    .endSpec()
                                    .build();

        Future<Void> blockingFuture = Future.future();

        this.vertx.createSharedWorkerExecutor("kubernetes-ops-pool").executeBlocking(
            future -> {
                Crds.topicOperation(this.kubeClient).inNamespace(this.namespace).create(kafkaTopic);
                future.complete();
            }, res -> {
                if (res.succeeded()) {
                    blockingFuture.complete();
                } else {
                    blockingFuture.fail(res.cause());
                }
            });   
            
        return blockingFuture;
    }
}