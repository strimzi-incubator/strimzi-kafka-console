/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

package io.strimzi;

import java.util.Map;

/**
 * Gesture mock configuration
 */
 public class GestureMockConfig {

    public static final String KAFKA_BOOTSTRAP_SERVERS = "KAFKA_BOOTSTRAP_SERVERS";
    public static final String TOPIC_DATA_FILTERED = "TOPIC_DATA_FILTERED";
    public static final String DELAY = "DELAY";

    public static final String DEFAULT_KAFKA_BOOTSTRAP_SERVERS = "localhost:9092";
    public static final String DEFAULT_TOPIC_DATA_FILTERED = "data-filtered";
    public static final int DEFAULT_DELAY = 5000;

    private final String kafkaBootstrapServers;
    private final long delay;
    private final String topicDataFiltered; 

    /**
     * Constructor
     * 
     * @param kafkaBootstrapServers the the Kafka bootstrap servers list
     */
    public GestureMockConfig(String kafkaBootstrapServers, long delay, String topicDataFiltered) {
        this.kafkaBootstrapServers = kafkaBootstrapServers;
        this.delay = delay;
        this.topicDataFiltered = topicDataFiltered;
    }

    /**
     * @return the the Kafka bootstrap servers list
     */
    public String getKafkaBootstrapServers() {
        return this.kafkaBootstrapServers;
    }

    /**
     * @return the delay betweenm each message
     */
    public long getDelay() {
        return this.delay;
    }

    /**
     * @return the to send the messages
     */
    public String getTopicDataFiltered() {
        return this.topicDataFiltered;
    }

    public static GestureMockConfig fromMap(Map<String, String> map) {
        
        String kafkaBootstrapServers = map.getOrDefault(GestureMockConfig.KAFKA_BOOTSTRAP_SERVERS, DEFAULT_KAFKA_BOOTSTRAP_SERVERS);
        long delay = Long.parseLong(map.getOrDefault(GestureMockConfig.DELAY, String.valueOf(DEFAULT_DELAY)));
        String topicDataFiltered = map.getOrDefault(GestureMockConfig.TOPIC_DATA_FILTERED, DEFAULT_TOPIC_DATA_FILTERED);

        return new GestureMockConfig(kafkaBootstrapServers, delay, topicDataFiltered);
    }

    @Override
    public String toString() {
        return "GestureMockConfig(" +
                "kafkaBootstrapServers=" + this.kafkaBootstrapServers +
                ",delay=" + this.delay +
                ",topicDataFiltered=" + this.topicDataFiltered +
                ")";
    }
    
 }