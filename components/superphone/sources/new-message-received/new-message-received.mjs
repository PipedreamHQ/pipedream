import common from "../common/webhook.mjs";
import subscriptions from "../common/subscriptions.mjs";

export default {
  ...common,
  key: "superphone-new-message-received",
  name: "New Message Received",
  description: "Triggered when a new message is received. [See the documentation](https://api.superphone.io/docs/webhooksubscription.doc.html)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return false;
    },
    getSubscriptions() {
      return [
        subscriptions.MESSAGE_RECEIVED,
      ];
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Message: ${resource.id}`,
        ts: Date.parse(resource.createdAt),
      };
    },
  },
};
