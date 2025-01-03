import app from "../../kafka.app.mjs";

export default {
  key: "kafka-create-topic",
  name: "Create Topic",
  description: "Create a new Kafka topic by specifying the topic name, number of partitions, and replication factor. [See the documentation](https://github.com/tulios/kafkajs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    topic: {
      type: "string",
      label: "Topic Name",
      description: "Name of the topic to create.",
    },
    numPartitions: {
      type: "integer",
      label: "Number Of Partitions",
      description: "The number of partitions for the topic.",
      optional: true,
    },
    replicationFactor: {
      type: "integer",
      label: "Replication Factor",
      description: "This is the number of replicas for each partition in the topic. Remember that the replication factor cannot be larger than the number of brokers in the Kafka cluster.",
      optional: true,
    },
    cleanupPolicy: {
      type: "string",
      label: "Cleanup Policy",
      description: "The cleanup policy for the app topic.",
      optional: true,
      options: [
        "delete",
        "compact",
      ],
    },
    retentionTime: {
      type: "integer",
      label: "Retention Time",
      description: "The number of milli seconds to keep the local log segment before it gets deleted.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      topic,
      numPartitions,
      replicationFactor,
      cleanupPolicy,
      retentionTime,
    } = this;

    const configEntries = [];

    if (cleanupPolicy) {
      configEntries.push({
        name: "cleanup.policy",
        value: cleanupPolicy,
      });
    }

    if (retentionTime) {
      configEntries.push({
        name: "retention.ms",
        value: String(retentionTime),
      });
    }

    const success = await app.createTopics({
      topics: [
        {
          topic,
          numPartitions,
          replicationFactor,
          configEntries,
        },
      ],
    });
    $.export("$summary", "Successfully created topic.");
    return {
      success,
    };
  },
};
