/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

package io.strimzi;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.strimzi.api.kafka.model.KafkaTopic;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.http.HttpServer;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.kafka.admin.TopicDescription;
import io.vertx.kafka.client.common.Node;
import io.vertx.kafka.client.common.TopicPartitionInfo;

public class ConsoleServer extends AbstractVerticle {

    private static final Logger log = LogManager.getLogger(ConsoleServer.class);

    private final ConsoleServerConfig config;
    private final KubernetesClient kubeClient;

    private TopicConsole topicConsole;

    public ConsoleServer(ConsoleServerConfig config, KubernetesClient kubeClient, TopicConsole topicConsole) {
        this.config = config;
        this.kubeClient = kubeClient;
        this.topicConsole = topicConsole;
    }

    @Override
    public void start(Future<Void> startFuture) throws Exception {
        log.info("Starting ConsoleServer");

        HttpServer server = this.vertx.createHttpServer();

        Router router = Router.router(this.vertx);
        router.route().handler(BodyHandler.create());

        router.get("/topics").handler(this::getTopics);
        router.get("/topics/:topicname").handler(this::getTopic);
        router.post("/topics").handler(this::createTopic);
        router.delete("/topics/:topicname").handler(this::deleteTopic);

        server.requestHandler(router).listen(8080, ar -> {
            if (ar.succeeded()) {
                log.info("HTTP REST API server started, listening on port {}", 8080);
                startFuture.complete();
            } else {
                log.error("HTTP REST API failed to start", ar.cause());
                startFuture.fail(ar.cause());
            }
        });
    }

    private void createTopic(RoutingContext routingContext) {
        try {
            JsonObject json = new JsonObject(routingContext.getBodyAsString());
            Topic topic = Topic.fromJson(json);
            log.info("Creating topic {}", topic);
            
            this.topicConsole.createTopic(topic).setHandler(ar -> {
                if (ar.succeeded()) {
                    log.info("Topic {} created", topic.getName());
                    routingContext.response().setStatusCode(202).end();
                } else {
                    log.error("Topic creation failed", ar.cause());
                    routingContext.response().setStatusCode(500).end();
                }
            });
        } catch (Exception ex) {
            log.error("Topic creation failed", ex);
            routingContext.response().setStatusCode(500).end();
        }
    }

    private void deleteTopic(RoutingContext routingContext) {
        String topicName = routingContext.request().getParam("topicname");
        log.info("Deleting topic {}", topicName);

        this.topicConsole.deleteTopic(topicName).setHandler(ar -> {
            if (ar.succeeded()) {
                log.info("Topic {} deleted", topicName);
                routingContext.response().setStatusCode(202).end();
            } else {
                log.error("Topic deletion failed", ar.cause());
                routingContext.response().setStatusCode(500).end();
            }
        });
    }

    private void getTopics(RoutingContext routingContext) {
        log.info("Getting topics list");

        this.topicConsole.listTopics().setHandler(ar -> {
            if (ar.succeeded()) {               

                List<KafkaTopic> kafkaTopicList = ar.result().getItems();
                JsonArray jsonTopics = new JsonArray();
                
                for (KafkaTopic kafkaTopic : kafkaTopicList) {
                    Topic topic = new Topic(kafkaTopic.getMetadata().getName(), 
                                            kafkaTopic.getSpec().getPartitions(), 
                                            kafkaTopic.getSpec().getReplicas(), 
                                            null, // we are not interested in configuration
                                            kafkaTopic.getMetadata().getCreationTimestamp());
                    jsonTopics.add(Topic.toJson(topic));
                }
                
                log.info("Topics list {}", jsonTopics);
                if (!jsonTopics.isEmpty()) {
                    routingContext.response().setStatusCode(200).end(jsonTopics.encode());
                } else {
                    routingContext.response().setStatusCode(404).end();
                }

            } else {
                log.error("Getting topics list failed", ar.cause());
                routingContext.response().setStatusCode(500).end();
            }
        });
    }

    private void getTopic(RoutingContext routingContext) {
        String topicName = routingContext.request().getParam("topicname");
        log.info("Get topic metadata");
        
        this.topicConsole.getTopic(topicName).setHandler(ar -> {
            if (ar.succeeded()) {
                TopicDescription topicDescription = ar.result();
                log.info("Topic {} metadata {}", topicName, topicDescription);

                List<TopicPartitions.PartitionInfo> partitions = new ArrayList<>();
                for (TopicPartitionInfo topicPartitionInfo : topicDescription.getPartitions()) {

                    List<Integer> replicas = topicPartitionInfo.getReplicas().stream()
                                                .map(n -> n.getId())
                                                .collect(Collectors.toList());

                    List<Integer> isr = topicPartitionInfo.getIsr().stream()
                                                .map(n -> n.getId())
                                                .collect(Collectors.toList());

                    TopicPartitions.PartitionInfo partitionInfo =
                        new TopicPartitions.PartitionInfo(topicPartitionInfo.getPartition(), topicPartitionInfo.getLeader().getId(), replicas, isr);

                    partitions.add(partitionInfo);
                }

                TopicPartitions topicPartitions = new TopicPartitions(topicDescription.getName(), partitions);
                routingContext.response().setStatusCode(200).end(TopicPartitions.toJson(topicPartitions).encode());
                
            } else {
                log.error("Getting topic metadata failed", ar.cause());
                routingContext.response().setStatusCode(500).end();
            }
        });
    }

    @Override
    public void stop(Future<Void> stopFuture) throws Exception {
        log.info("Stopping ConsoleServer");
        super.stop(stopFuture);
    }
}