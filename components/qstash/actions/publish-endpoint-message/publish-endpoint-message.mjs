import qstash from "../../qstash.app.mjs";

export default {
  name: "Publish Endpoint Message",
  version: "0.0.1",
  key: "qstash-publish-endpoint-message",
  description: "Publish a message to call back to a URL",
  type: "action",
  props: {
    qstash,
    endpoint: {
      propDefinition: [
        qstash,
        "endpoint",
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
      body, endpoint, deduplicationId, retries, cron, delay, contentBasedDeduplicationEnabled,
    } = this;

    return this.qstash.publishEndpointMessage({
      $,
      body,
      endpoint,
      deduplicationId,
      contentBasedDeduplicationEnabled,
      retries,
      cron,
      delay,
    });
  },
};
