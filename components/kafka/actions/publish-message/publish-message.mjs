import app from "../../kafka.app.mjs";

export default {
  key: "kafka-publish-message",
  name: "Publish Message",
  description: "Sends a message to a specified Kafka topic. Requires specifying the topic, message key, and value. Optional properties include headers and partition. [See the documentation](https://github.com/tulios/kafkajs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    topic: {
      description: "The topic to send the message to.",
      propDefinition: [
        app,
        "topic",
      ],
    },
    messageKey: {
      type: "string",
      label: "Message Key",
      description: "Key of the message.",
      optional: true,
    },
    messageValue: {
      type: "string",
      label: "Message Value",
      description: "Value of the message.",
    },
    partition: {
      type: "integer",
      label: "Partition",
      description: "The specific partition to send the message to, optional.",
      optional: true,
    },
    headers: {
      type: "object",
      label: "Headers",
      description: "Optional headers you want to send along with the message.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      topic,
      messageKey,
      messageValue,
      partition,
      headers,
    } = this;

    const response = await app.sendMessages({
      topic,
      messages: [
        {
          key: messageKey,
          value: messageValue,
          partition,
          headers,
        },
      ],
    });

    if (!response?.length) {
      throw new Error("Failed to publish message. Please see the kafka app logs for more information.");
    }

    $.export("$summary", "Successfully published message.");
    return response;
  },
};
