/*
 * Copyright 2017-2018, Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

 package io.strimzi;

 public class Topic {

    private String name;
    private int partitions;
    private int replicas;

    public Topic() {
        
    }

    public Topic(String name, int partitions, int replicas) {
        this.name = name;
        this.partitions = partitions;
        this.replicas = replicas;
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

 }