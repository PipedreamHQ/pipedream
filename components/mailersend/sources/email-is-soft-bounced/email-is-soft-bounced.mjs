import common from "../common/webhook.mjs";
import { EmailWebhookEventType } from "mailersend";

export default {
  ...common,
  key: "mailersend-email-is-soft-bounced",
  name: "New Email Is Soft Bounced (Instant)",
  description: "Emit new event when your email is not delivered because it soft bounced. [See the documentation](https://developers.mailersend.com/api/v1/webhooks.html#webhooks-overview)",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        EmailWebhookEventType.SOFT_BOUNCED,
      ];
    },
  },
};
