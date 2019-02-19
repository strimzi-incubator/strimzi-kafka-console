/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

package io.strimzi;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;

public class ConsoleServer extends AbstractVerticle {

    private static final Logger log = LogManager.getLogger(ConsoleServer.class);

    @Override
    public void start(Future<Void> startFuture) throws Exception {
        log.info("Starting ConsoleServer");
        super.start(startFuture);
    }

    @Override
    public void stop(Future<Void> stopFuture) throws Exception {
        log.info("Stopping ConsoleServer");
        super.stop(stopFuture);
    }
}