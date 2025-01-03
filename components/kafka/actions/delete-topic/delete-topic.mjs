import app from "../../kafka.app.mjs";

export default {
  key: "kafka-delete-topic",
  name: "Delete Topic",
  description: "Deletes a specified Kafka topic. Requires the topic name as input. [See the documentation](https://github.com/tulios/kafkajs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    topic: {
      description: "The Kafka topic to delete.",
      propDefinition: [
        app,
        "topic",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      topic,
    } = this;

    await app.deleteTopics({
      topics: [
        topic,
      ],
    });

    $.export("$summary", "Successfully deleted topic.");
    return {
      success: true,
    };
  },
};
