import common from "../common/webhook.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "shopify-new-event-emitted",
  name: "New Event Emitted (Instant)",
  type: "source",
  description: "Emit new event for each new Shopify event.",
  version: "0.0.8",
  dedupe: "unique",
  props: {
    ...common.props,
    topic: {
      type: "string",
      label: "Event Topic",
      description: "Event topic that triggers the webhook.",
      options: constants.EVENT_TOPICS,
    },
  },
  methods: {
    ...common.methods,
    getTopic() {
      return this.topic;
    },
    generateMeta() {
      const ts = Date.now();
      return {
        id: ts,
        summary: `New Event Emitted at ${new Date(ts)}.`,
        ts,
      };
    },
  },
};
