/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

package io.strimzi;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.http.HttpServer;
import io.vertx.core.json.Json;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;

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
        log.info("createTopic");
        Topic topic = Json.decodeValue(routingContext.getBodyAsString(), Topic.class);
        this.topicConsole.createTopic(topic).setHandler(ar -> {
            if (ar.succeeded()) {
                routingContext.response().setStatusCode(202).end();
            } else {
                routingContext.response().setStatusCode(500).end();
            }
        });
    }

    private void getTopics(RoutingContext routingContext) {
        log.info("getTopics");
        routingContext.response().end("list of topics");
    }

    private void getTopic(RoutingContext routingContext) {
        log.info("getTopic");
        String topicName = routingContext.request().getParam("topicname");
        routingContext.response().end(topicName);
    }

    @Override
    public void stop(Future<Void> stopFuture) throws Exception {
        log.info("Stopping ConsoleServer");
        super.stop(stopFuture);
    }
}