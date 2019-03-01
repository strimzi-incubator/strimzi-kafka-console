/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
package io.strimzi;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.kafka.clients.admin.AdminClientConfig;

import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.kafka.admin.ConsumerGroupDescription;
import io.vertx.kafka.admin.KafkaAdminClient;
import io.vertx.kafka.admin.NewTopic;
import io.vertx.kafka.admin.TopicDescription;

public class KafkaConsole {

    private final KafkaAdminClient kafkaAdminClient;

    public KafkaConsole(Vertx vertx, String kafkaBootstrapServers) {
        Properties props = new Properties();
        props.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaBootstrapServers);

        this.kafkaAdminClient = KafkaAdminClient.create(vertx, props);
    }

    /**
     * Get the list of topics
     * 
     * @return a {@link Future} with the set of topic names
     */
    public Future<Set<String>> listTopics() {
        Future<Set<String>> future = Future.future();
        this.kafkaAdminClient.listTopics(res -> {
            if (res.succeeded()) {
                future.complete(res.result());
            } else {
                future.fail(res.cause());
            }
        });
        return future;
    }

    /**
     * Delete the topic specified by the name
     * 
     * @param topicName the name of the topic to delete
     * @return a {@link Future}
     */
    public Future<Void> deleteTopic(String topicName) {
        Future<Void> future = Future.future();
        this.kafkaAdminClient.deleteTopics(Collections.singletonList(topicName), res -> {
            if (res.succeeded()) {
                future.complete();
            } else {
                future.fail(res.cause());
            }
        });
        return future;
    }

    /**
     * Create the topic described by the provided {@link NewTopic} instance
     * 
     * @param newTopic the topic to create
     * @return a {@link Future}
     */
    public Future<Void> createTopic(NewTopic newTopic) {
        Future<Void> future = Future.future();
        this.kafkaAdminClient.createTopics(Collections.singletonList(newTopic), res -> {
            if (res.succeeded()) {
                future.complete();
            } else {
                future.fail(res.cause());
            }
        });
        return future;
    }

    /**
     * Get metadata information for the provided list of topic names
     * 
     * @param topicNames list of topic names for which getting metadata
     * @return a {@link Future} with the mapping between topic names and related descriptions with metadata
     */
    public Future<Map<String, TopicDescription>> describeTopics(List<String> topicNames) {
        Future<Map<String, TopicDescription>> future = Future.future();
        this.kafkaAdminClient.describeTopics(topicNames, res -> {
            if (res.succeeded()) {
                future.complete(res.result());
            } else {
                future.fail(res.cause());
            }
        });
        return future;
    }

    /**
     * Get the list of consumer groups
     * 
     * @return a {@link Future} with the set of consumer groups
     */
    public Future<Set<String>> listConsumerGroups() {
        Future<Set<String>> future = Future.future();
        this.kafkaAdminClient.listConsumerGroups(res -> {
            if (res.succeeded()) {
                future.complete(res.result().stream()
                                .map(cg -> cg.getGroupId())
                                .collect(Collectors.toSet()));
            } else {
                future.fail(res.cause());
            }
        });
        return future;
    }

    /**
     * Get information for the provided list of consumer groups
     * 
     * @param consumerGroups list of consumer groups for which getting information
     * @return a {@link Future} with the mapping between consumer group and related descriptions with information
     */
    public Future<Map<String, ConsumerGroupDescription>> describeConsumerGroups(List<String> consumerGroups) {
        Future<Map<String, ConsumerGroupDescription>> future = Future.future();
        this.kafkaAdminClient.describeConsumerGroups(consumerGroups, res -> {
            if (res.succeeded()) {
                future.complete(res.result());
            } else {
                future.fail(res.cause());
            }
        });
        return future;
    }
}