import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "plaid-new-event-instant",
  name: "New Event (Instant)",
  description: "Emit new event when there are changes to Plaid Items or the status of asynchronous processes. [See the documentation](https://plaid.com/docs/api/webhooks/).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(resource) {
      const ts = Date.now();
      return {
        id: ts,
        summary: `New Event: ${resource.webhook_type}.${resource.webhook_code}`,
        ts,
      };
    },
  },
  sampleEmit,
};
