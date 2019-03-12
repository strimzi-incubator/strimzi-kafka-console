/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

package io.strimzi;

import java.util.Properties;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.kafka.client.producer.KafkaProducer;
import io.vertx.kafka.client.producer.KafkaProducerRecord;

/**
 * GestureMock
 */
public class GestureMock extends AbstractVerticle {

    private static final Logger log = LogManager.getLogger(GestureMock.class);

    private GestureMockConfig config;
    private long timerId;
    private KafkaProducer<String, String> producer;

    public GestureMock(GestureMockConfig config) {
        this.config = config;
    }

    @Override
    public void start(Future<Void> startFuture) throws Exception {
        log.info("Gesture mock started");

        this.producer = createProducer();

        this.timerId = vertx.setPeriodic(this.config.getDelay(), timerId -> {

            JsonObject json = new JsonObject();
            json.put("userid", "user1234");
            json.put("machineid", "machine1234");
            json.put("gesture", "gesture1234");

            KafkaProducerRecord<String, String> record =
                    KafkaProducerRecord.create(this.config.getTopicDataFiltered(), json.getString("userid"), json.encode());

            producer.write(record, ar -> {
                if (ar.succeeded()) {
                    log.info("Gesture data: {} sent to [{}, {}, {}]", json.encode(),
                            ar.result().getTopic(), ar.result().getPartition(), ar.result().getOffset());
                } else {
                    log.error("Failed to send gesture data");
                }
            });
        });

        startFuture.complete();
    }

    @Override
    public void stop(Future<Void> stopFuture) throws Exception {
        
        this.producer.close();
        this.vertx.cancelTimer(this.timerId);

        log.info("Gesture mock stopped");

        super.stop(stopFuture);
    }

    private <K, V> KafkaProducer<K, V> createProducer() {

        Properties config = new Properties();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, this.config.getKafkaBootstrapServers());
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.ACKS_CONFIG, "1");

        KafkaProducer<K, V> producer = KafkaProducer.create(this.vertx, config);
        producer.exceptionHandler(ex -> {
           log.error("Producer exception", ex);
        });

        return producer;
    }
}