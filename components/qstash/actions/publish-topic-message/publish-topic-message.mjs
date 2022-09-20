import qstash from "../../qstash.app.mjs";

export default {
  name: "Publish Topic Message",
  version: "0.0.1",
  key: "publish-topic-message",
  description: "Publish a message to a topic",
  props: {
    qstash,
    topic: {
      propDefinition: [
        qstash,
        "topic",
      ],
    },
    body: {
      propDefinition: [
        qstash,
        "body",
      ],
    },
    retries: {
      propDefinition: [
        qstash,
        "retries",
      ],
    },
    deduplicationId: {
      propDefinition: [
        qstash,
        "deduplicationId",
      ],
    },
    delay: {
      propDefinition: [
        qstash,
        "delay",
      ],
    },
    cron: {
      propDefinition: [
        qstash,
        "cron",
      ],
    },
  },
  type: "action",
  async run({ $ }) {
    const {
      body, topic, delay, retries, deduplicationId, cron,
    } = this;

    return await this.qstash.publishTopicMessage({
      $,
      body,
      topic,
      delay,
      retries,
      deduplicationId,
      cron,
    });
  },
};
