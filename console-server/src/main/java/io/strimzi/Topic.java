/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

package io.strimzi;

import java.util.HashMap;
import java.util.Map;

import io.vertx.core.json.JsonObject;

public class Topic {

    private String name;
    private int partitions;
    private int replicas;
    private Map<String, Object> config = new HashMap<>();

    public Topic(String name, int partitions, int replicas, Map<String, Object> config) {
        this.name = name;
        this.partitions = partitions;
        this.replicas = replicas;
        if (config != null) {
            this.config.putAll(config);
        }
    }

    /**
     * @return the name
     */
    public String getName() {
        return this.name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the partitions
     */
    public int getPartitions() {
        return this.partitions;
    }

    /**
     * @param partitions the partitions to set
     */
    public void setPartitions(int partitions) {
        this.partitions = partitions;
    }

    /**
     * @return the replicas
     */
    public int getReplicas() {
        return this.replicas;
    }

    /**
     * @param replicas the replicas to set
     */
    public void setReplicas(int replicas) {
        this.replicas = replicas;
    }

    /**
     * @return the config
     */
    public Map<String, Object> getConfig() {
        return this.config;
    }

    /**
     * @param config the config to set
     */
    public void setConfig(Map<String, Object> config) {
        this.config = config;
    }

    public static Topic fromJson(JsonObject json) {
        String name = json.getString("name");
        int partitions = Integer.parseInt(json.getValue("partitions").toString());
        int replicas = Integer.parseInt(json.getValue("replicas").toString());

        Map<String, Object> config = null;
        JsonObject configJson = json.getJsonObject("config");
        if (configJson != null) {
            config = configJson.getMap();
        }
        return new Topic(name, partitions, replicas, config);
    }
 }