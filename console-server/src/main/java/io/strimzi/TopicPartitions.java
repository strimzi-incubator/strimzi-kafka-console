/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

package io.strimzi;

import java.util.List;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

/**
 * TopicPartitions
 */
public class TopicPartitions {

    private String name;
    private List<PartitionInfo> partitions;

    public TopicPartitions(String name, List<PartitionInfo> partitions) {
        this.name = name;
        this.partitions = partitions;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
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
    public List<PartitionInfo> getPartitions() {
        return partitions;
    }

    /**
     * @param partitions the partitions to set
     */
    public void setPartitions(List<PartitionInfo> partitions) {
        this.partitions = partitions;
    }

    public static JsonObject toJson(TopicPartitions topicPartitions) {
        JsonObject json = new JsonObject();
        json.put("name", topicPartitions.getName());

        JsonArray jsonPartitions = new JsonArray();
        for (PartitionInfo partitionInfo : topicPartitions.getPartitions()) {
            jsonPartitions.add(PartitionInfo.toJson(partitionInfo));
        }
        json.put("partitions", jsonPartitions);
        return json;
    }


    public static class PartitionInfo {

        private int id;
        private int leader;
        private List<Integer> replicas;
        private List<Integer> isr;

        public PartitionInfo(int id, int leader, List<Integer> replicas, List<Integer> isr) {
            this.id = id;
            this.leader = leader;
            this.replicas = replicas;
            this.isr = isr;
        }

        /**
         * @return the id
         */
        public int getId() {
            return id;
        }

        /**
         * @param id the id to set
         */
        public void setId(int id) {
            this.id = id;
        }

        /**
         * @return the leader
         */
        public int getLeader() {
            return leader;
        }

        /**
         * @param leader the leader to set
         */
        public void setLeader(int leader) {
            this.leader = leader;
        }

        /**
         * @return the replicas
         */
        public List<Integer> getReplicas() {
            return replicas;
        }

        /**
         * @param replicas the replicas to set
         */
        public void setReplicas(List<Integer> replicas) {
            this.replicas = replicas;
        }

        /**
         * @return the isr
         */
        public List<Integer> getIsr() {
            return isr;
        }

        /**
         * @param isr the isr to set
         */
        public void setIsr(List<Integer> isr) {
            this.isr = isr;
        }

        public static JsonObject toJson(PartitionInfo partitionInfo) {
            JsonObject json = new JsonObject();
            json.put("id", partitionInfo.getId());
            json.put("leader", partitionInfo.getLeader());
            json.put("replicas", partitionInfo.getReplicas());
            json.put("isr", partitionInfo.getIsr());
            return json;
        }
    }
}