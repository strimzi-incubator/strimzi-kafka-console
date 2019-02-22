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

    public static final String STRIMZI_NAMESPACE = "STRIMZI_NAMESPACE";
    public static final String KAFKA_BOOTSTRAP_SERVERS = "KAFKA_BOOTSTRAP_SERVERS";

    public static final String DEFAULT_KAFKA_BOOTSTRAP_SERVERS = "localhost:9092";

    private final String namespace;
    private final String kafkaBootstrapServers;

    /**
     * Constructor
     * 
     * @param namespace namespace in which the console server run and create resources
     * @param kafkaBootstrapServers the the Kafka bootstrap servers list
     */
    public ConsoleServerConfig(String namespace, String kafkaBootstrapServers) {
        this.namespace = namespace;
        this.kafkaBootstrapServers = kafkaBootstrapServers;
    }

    /**
     * @return the namenamespace in which the console server run and create resourcesspace
     */
    public String getNamespace() {
        return namespace;
    }

    /**
     * @return the the Kafka bootstrap servers list
     */
    public String getKafkaBootstrapServers() {
        return this.kafkaBootstrapServers;
    }

    public static ConsoleServerConfig fromMap(Map<String, String> map) {
        
        String namespace = map.get(ConsoleServerConfig.STRIMZI_NAMESPACE);
        if (namespace == null || namespace.isEmpty()) {
            throw new RuntimeException(ConsoleServerConfig.STRIMZI_NAMESPACE + " cannot be null");
        }

        String kafkaBootstrapServers = DEFAULT_KAFKA_BOOTSTRAP_SERVERS;
        String kafkaBootstrapServersEnvVar = map.get(ConsoleServerConfig.KAFKA_BOOTSTRAP_SERVERS);
        if (kafkaBootstrapServersEnvVar != null && !kafkaBootstrapServers.isEmpty()) {
            kafkaBootstrapServers = kafkaBootstrapServersEnvVar;
        }

        return new ConsoleServerConfig(namespace,kafkaBootstrapServers);
    }

    @Override
    public String toString() {
        return "ConsoleServerConfig(" +
                "namespace=" + this.namespace +
                ",kafkaBootstrapServers=" + this.kafkaBootstrapServers +
                ")";
    }
 }