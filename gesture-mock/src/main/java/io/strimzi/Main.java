/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

package io.strimzi;

import io.vertx.core.Vertx;

public class Main 
{
    public static void main( String[] args )
    {
        Vertx vertx = Vertx.vertx();

        GestureMockConfig config = GestureMockConfig.fromMap(System.getenv());
        GestureMock gestureMock = new GestureMock(config);

        vertx.deployVerticle(gestureMock);
    }
}
