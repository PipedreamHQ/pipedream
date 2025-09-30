import qstash from "../../qstash.app.mjs";

export default {
  name: "Publish Topic Message",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "qstash-publish-topic-message",
  description: "Publish a message to a topic",
  type: "action",
  props: {
    qstash,
    topic: {
      type: "string",
      label: "QStash Topic",
      description: "The QStash topic to publish a message to.",
      async options() {
        const topics = await this.qstash.listTopics({
          $: this,
        });

        return topics.map((topic) => topic.name);
      },
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
    contentBasedDeduplicationEnabled: {
      propDefinition: [
        qstash,
        "contentBasedDeduplicationEnabled",
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
  async run({ $ }) {
    const {
      body, topic, delay, retries, deduplicationId, cron, contentBasedDeduplicationEnabled,
    } = this;

    return this.qstash.publishTopicMessage({
      $,
      body,
      topic,
      delay,
      retries,
      contentBasedDeduplicationEnabled,
      deduplicationId,
      cron,
    });
  },
};
