import common from "../common/webhook.mjs";
import { EmailWebhookEventType } from "mailersend";

export default {
  ...common,
  key: "mailersend-recipient-unsubscribed",
  name: "New Recipient Unsubscribed (Instant)",
  description: "Emit new event when the recipient unsubscribes from your emails. [See the documentation](https://developers.mailersend.com/api/v1/webhooks.html#webhooks-overview)",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        EmailWebhookEventType.UNSUBSCRIBED,
      ];
    },
  },
};
