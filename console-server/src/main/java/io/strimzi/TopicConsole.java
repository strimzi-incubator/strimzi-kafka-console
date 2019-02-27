/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
package io.strimzi;

import java.util.Collections;
import java.util.Properties;

import org.apache.kafka.clients.admin.AdminClientConfig;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.strimzi.api.kafka.Crds;
import io.strimzi.api.kafka.KafkaTopicList;
import io.strimzi.api.kafka.model.KafkaTopic;
import io.strimzi.api.kafka.model.KafkaTopicBuilder;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.kafka.admin.KafkaAdminClient;
import io.vertx.kafka.admin.TopicDescription;

public class TopicConsole {

    private final Vertx vertx;
    private final KubernetesClient kubeClient;
    private final KafkaAdminClient kafkaAdminClient;

    private final String namespace;
    private final String kafkaBootstrapServers;


    
    public TopicConsole(Vertx vertx, KubernetesClient kubeClient, String namespace, String kafkaBootstrapServers) {
        this.vertx = vertx;
        this.kubeClient = kubeClient;
        this.namespace = namespace;
        this.kafkaBootstrapServers = kafkaBootstrapServers;

        Properties props = new Properties();
        props.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaBootstrapServers);

        this.kafkaAdminClient = KafkaAdminClient.create(vertx, props);
    }

    public Future<KafkaTopicList> listTopics() {

        Future<KafkaTopicList> blockingFuture = Future.future();

        this.vertx.createSharedWorkerExecutor("kubernetes-ops-pool").executeBlocking(
            future -> {
                try {
                    KafkaTopicList kafkaTopicList = Crds.topicOperation(this.kubeClient).inNamespace(this.namespace).list();
                    future.complete(kafkaTopicList);
                } catch (Exception ex) {
                    future.fail(ex);
                }
            }, blockingFuture.completer());   
            
        return blockingFuture;
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

    public Future<Void> createTopic(KafkaTopic kafkaTopic) {

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

    public Future<TopicDescription> getTopic(String topicName) {

        Future<TopicDescription> future = Future.future();

        this.kafkaAdminClient.describeTopics(Collections.singletonList(topicName), res -> {
            if (res.succeeded()) {
                future.complete(res.result().get(topicName));
            } else {
                future.fail(res.cause());
            }
        });

        return future;
    }
}