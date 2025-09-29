import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "notion-new-webhook-event-instant",
  name: "New Webhook Event (Instant)",
  description: "Emit new event each time a webhook event is received. Webhook must be setup in Notion. [See the documentation](https://developers.notion.com/reference/webhooks#step-1-creating-a-webhook-subscription)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _generateMeta(event) {
      return {
        id: event.id,
        summary: `Webhook event: ${event.type}`,
        ts: Date.now(),
      };
    },
    processEvent(event) {
      const meta = this._generateMeta(event);
      this.$emit(event, meta);
    },
  },
  sampleEmit,
};
