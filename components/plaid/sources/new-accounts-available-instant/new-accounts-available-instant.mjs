import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "plaid-new-accounts-available-instant",
  name: "New Accounts Available (Instant)",
  description: "Emit new event when there are new accounts available at the Financial Institution. [See the documentation](https://plaid.com/docs/api/webhooks/).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    isEventRelevant(resource) {
      const webhookType = events.WEBHOOK_TYPE.ITEM;
      const webhookCode = events.WEBHOOK_CODE[webhookType].NEW_ACCOUNTS_AVAILABLE;
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
