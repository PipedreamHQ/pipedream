import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "plaid-sync-updates-available-instant",
  name: "Sync Updates Available (Instant)",
  description: "Emit new event when there are new updates available for a connected account. [See the documentation](https://plaid.com/docs/api/webhooks/).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isEventRelevant(resource) {
      const webhookType = events.WEBHOOK_TYPE.TRANSACTIONS;
      const webhookCode = events.WEBHOOK_CODE[webhookType].SYNC_UPDATES_AVAILABLE;
      return resource.webhook_type === webhookType && resource.webhook_code === webhookCode;
    },
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
