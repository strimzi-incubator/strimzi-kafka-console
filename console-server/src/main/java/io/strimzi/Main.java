/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
package io.strimzi;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import io.fabric8.kubernetes.client.DefaultKubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.vertx.core.Future;
import io.vertx.core.Vertx;

public class Main {

    private static final Logger log = LogManager.getLogger(Main.class);
    
    public static void main(String[] args) {
        log.info("ConsoleServer {} is starting", Main.class.getPackage().getImplementationVersion());

        ConsoleServerConfig config = ConsoleServerConfig.fromMap(System.getenv());
        Vertx vertx = Vertx.vertx();
        KubernetesClient kubeClient = new DefaultKubernetesClient();

        run(vertx, config, kubeClient).setHandler(res -> {
            if (res.failed()) {
                log.error("Unable to start Console Server", res.cause());
                System.exit(1);
            }
        });
    }

    static Future<String> run(Vertx vertx, ConsoleServerConfig config, KubernetesClient kubeClient) {

        Future<String> fut = Future.future();
        KafkaConsole topicConsole = new KafkaConsole(vertx, config.getKafkaBootstrapServers());
        ConsoleServer consoleServer = new ConsoleServer(topicConsole);

        vertx.deployVerticle(consoleServer, 
            res -> {
                if (res.succeeded()) {
                    log.info("ConsoleServer verticle started with config: {}", config);
                } else {
                    log.error("ConsoleServer verticle failed to start", res.cause());
                    System.exit(1);
                }
                fut.completer().handle(res);
            }
        );
        return fut;
    }
}
