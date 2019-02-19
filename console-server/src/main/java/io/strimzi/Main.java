/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
package io.strimzi;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import io.vertx.core.Vertx;

public class Main {

    private static final Logger log = LogManager.getLogger(Main.class);
    
    public static void main(String[] args) {
        log.info("ConsoleServer {} is starting", Main.class.getPackage().getImplementationVersion());

        ConsoleServer consoleServer = new ConsoleServer();
        Vertx vertx = Vertx.vertx();

        vertx.deployVerticle(consoleServer, 
            res -> {
                if (res.succeeded()) {
                    log.info("ConsoleServer verticle started");
                } else {
                    log.error("ConsoleServer verticle failed to start", res.cause());
                    System.exit(1);
                }
            }
        );
    }
}
