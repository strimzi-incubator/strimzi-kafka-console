/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

package io.strimzi;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import io.strimzi.api.kafka.model.KafkaTopic;
import io.strimzi.api.kafka.model.KafkaTopicBuilder;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.kafka.admin.TopicDescription;
import io.vertx.kafka.client.common.TopicPartitionInfo;

/**
 * TopicUtils
 */
public class TopicUtils {

    /**
     * Get a {@link KafkaTopic} instance from a JSON representation
     * 
     * @param the JSON representation
     * @param labels labels to set on the {@link KafkaTopic} instance
     * @return the {@link KafkaTopic} instance
     */
    public static KafkaTopic from(JsonObject json, Map<String, String> labels) {
        String name = json.getString("name");
        int partitions = Integer.parseInt(json.getValue("partitions").toString());
        int replicas = Integer.parseInt(json.getValue("replicas").toString());

        Map<String, Object> config = null;
        JsonObject configJson = json.getJsonObject("config");
        if (configJson != null) {
            config = configJson.getMap();
        }
        
        return new KafkaTopicBuilder()
                    .withNewMetadata()
                        .withName(name)
                        .addToLabels(labels)
                    .endMetadata()
                    .withNewSpec()
                        .withTopicName(name)
                        .withPartitions(partitions)
                        .withReplicas(replicas)
                        .withConfig(config)
                    .endSpec()
                    .build();
    }

    /**
     * Get a JSON representation from a {@link KafkaTopic} instance
     * 
     * @param kafkaTopic the {@link KafkaTopic} instance
     * @return the JSON representation
     */
    public static JsonObject to(KafkaTopic kafkaTopic) {
        JsonObject json = new JsonObject();
        json.put("name", kafkaTopic.getMetadata().getName());
        json.put("creationTimestamp", kafkaTopic.getMetadata().getCreationTimestamp());
        json.put("partitions", kafkaTopic.getSpec().getPartitions());
        json.put("replicas", kafkaTopic.getSpec().getReplicas());
        json.put("config", kafkaTopic.getSpec().getConfig());
        return json;
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
   
    /**
     * Get a JSON representation from a {@link KafkaTopic} list
     * 
     * @param kafkaTopicList {@link KafkaTopic} list
     * @return the JSON epresentation
     */
    public static JsonArray to(List<KafkaTopic> kafkaTopicList) {
        JsonArray jsonTopics = new JsonArray();  
        for (KafkaTopic kafkaTopic : kafkaTopicList) {
            jsonTopics.add(TopicUtils.to(kafkaTopic));
        }
        return jsonTopics;
    }
}