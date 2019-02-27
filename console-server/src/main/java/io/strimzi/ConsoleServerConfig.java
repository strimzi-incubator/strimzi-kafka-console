/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

package io.strimzi;

import java.util.Map;

/**
 * Console server configuration
 */
 public class ConsoleServerConfig {

    public static final String KAFKA_BOOTSTRAP_SERVERS = "KAFKA_BOOTSTRAP_SERVERS";

    public static final String DEFAULT_KAFKA_BOOTSTRAP_SERVERS = "localhost:9092";

    private final String kafkaBootstrapServers;

    /**
     * Constructor
     * 
     * @param kafkaBootstrapServers the the Kafka bootstrap servers list
     */
    public ConsoleServerConfig(String kafkaBootstrapServers) {
        this.kafkaBootstrapServers = kafkaBootstrapServers;
    }

    /**
     * @return the the Kafka bootstrap servers list
     */
    public String getKafkaBootstrapServers() {
        return this.kafkaBootstrapServers;
    }

    public static ConsoleServerConfig fromMap(Map<String, String> map) {
        
        String kafkaBootstrapServers = DEFAULT_KAFKA_BOOTSTRAP_SERVERS;
        String kafkaBootstrapServersEnvVar = map.get(ConsoleServerConfig.KAFKA_BOOTSTRAP_SERVERS);
        if (kafkaBootstrapServersEnvVar != null && !kafkaBootstrapServers.isEmpty()) {
            kafkaBootstrapServers = kafkaBootstrapServersEnvVar;
        }

        return new ConsoleServerConfig(kafkaBootstrapServers);
    }

    @Override
    public String toString() {
        return "ConsoleServerConfig(" +
                "kafkaBootstrapServers=" + this.kafkaBootstrapServers +
                ")";
    }
 }