import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "quaderno-invoice-created",
  name: "Invoice Created",
  description: "Trigger when a new invoice is generated in Quaderno. [See the Documentation](https://developers.quaderno.io/api/#tag/Webhooks/operation/createWebhook).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.DEFAULT;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Resource: ${resource.name}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
