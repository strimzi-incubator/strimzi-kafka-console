/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

package io.strimzi;

import java.util.Map;
import java.util.stream.Collectors;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.kafka.admin.NewTopic;
import io.vertx.kafka.admin.TopicDescription;
import io.vertx.kafka.client.common.TopicPartitionInfo;

/**
 * Utils class for topics related representation tranformation (JSON <-> Vert.x models)
 */
public class TopicUtils {

    /**
     * Get a {@link NewTopic} instance from a JSON representation
     * 
     * @param the JSON representation
     * @return the {@link NewTopic} instance
     */
    public static NewTopic from(JsonObject json) {
        String name = json.getString("name");
        int partitions = Integer.parseInt(json.getValue("partitions").toString());
        int replicas = Integer.parseInt(json.getValue("replicas").toString());

        NewTopic newTopic = new NewTopic(name, partitions, (short)replicas);

        Map<String, Object> config = null;
        JsonObject configJson = json.getJsonObject("config");
        if (configJson != null) {
            config = configJson.getMap();
            // from JSON we can have numeric values (i.e. partitions) but native admin client gets always strings
            newTopic.setConfig(config.entrySet().stream()
                                .collect(Collectors.toMap(
                                    e -> e.getKey(), 
                                    e -> String.valueOf(e.getValue()))));
        }
        return newTopic;        
    }

    /**
     * Get a JSON representation from a map of topic names to related {@link TopicDescription} instance
     * 
     * @param topics map of topic names to related {@link TopicDescription} instance
     * @return the JSON epresentation
     */
    public static JsonArray to(Map<String, TopicDescription> topics) {
        JsonArray jsonTopics = new JsonArray();

        for (Map.Entry<String, TopicDescription> topic : topics.entrySet()) {
            jsonTopics.add(TopicUtils.to(topic.getValue()));
        }
        return jsonTopics;
    }

    /**
     * Get a JSON representation from a {@link TopicDescription} instance
     * 
     * @param topicDescription the {@link TopicDescription} instance
     * @return the JSON epresentation
     */
    public static JsonObject to(TopicDescription topicDescription) {
        JsonObject json = new JsonObject();
        json.put("name", topicDescription.getName());

        JsonArray jsonPartitions = new JsonArray();
        for (TopicPartitionInfo topicPartitionInfo : topicDescription.getPartitions()) {
            JsonObject jsonTopicPartitionInfo = new JsonObject();
            jsonTopicPartitionInfo.put("id", topicPartitionInfo.getPartition());
            jsonTopicPartitionInfo.put("leader", topicPartitionInfo.getLeader().getId());
            jsonTopicPartitionInfo.put("replicas", topicPartitionInfo.getReplicas().stream()
                                                    .map(n -> n.getId())
                                                    .collect(Collectors.toList()));
            jsonTopicPartitionInfo.put("isr", topicPartitionInfo.getIsr().stream()
                                                    .map(n -> n.getId())
                                                    .collect(Collectors.toList()));
            jsonPartitions.add(jsonTopicPartitionInfo);
        }
        json.put("partitions", jsonPartitions);
        return json;
    }
}