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
import io.vertx.ext.web.Router;

public class ConsoleServer extends AbstractVerticle {

    private static final Logger log = LogManager.getLogger(ConsoleServer.class);

    private final ConsoleServerConfig config;
    private final KubernetesClient kubeClient;

    private TopicConsole topicConsole;

    public ConsoleServer(ConsoleServerConfig config, KubernetesClient kubeClient) {
        this.config = config;
        this.kubeClient = kubeClient;
        this.topicConsole = new TopicConsole(kubeClient, config.getKafkaBootstrapServers());
    }

    @Override
    public void start(Future<Void> startFuture) throws Exception {
        log.info("Starting ConsoleServer");

        HttpServer server = this.vertx.createHttpServer();

        Router router = Router.router(this.vertx);

        router.get("/topics").handler(routingContext -> {
            routingContext.response().end("topics");
        });
        router.get("/topics/:topicname").handler(routingContext -> {
            String topicName = routingContext.request().getParam("topicname");
            routingContext.response().end(topicName);
        });
        router.post("/topics/:topicname").handler(routingContext -> {
            String topicName = routingContext.request().getParam("topicname");
            routingContext.response().end(topicName);
        });

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

    @Override
    public void stop(Future<Void> stopFuture) throws Exception {
        log.info("Stopping ConsoleServer");
        super.stop(stopFuture);
    }
}