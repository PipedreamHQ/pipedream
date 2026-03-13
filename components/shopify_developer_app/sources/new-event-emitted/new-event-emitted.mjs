import common from "../common/webhook-metafields.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-event-emitted",
  name: "New Event Emitted (Instant)",
  type: "source",
  description: "Emit new event for each new Shopify event.",
  version: "0.0.16",
  dedupe: "unique",
  props: {
    ...common.props,
    topic: {
      type: "string",
      label: "Event Topic",
      description: "Event topic that triggers the webhook.",
      options: Object.entries(constants.EVENT_TOPIC).map(([
        key,
        value,
      ]) => ({
        value: key,
        label: value,
      })),
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
        summary: `New Event Emitted at ${new Date(ts)}`,
        ts,
      };
    },
  },
};
