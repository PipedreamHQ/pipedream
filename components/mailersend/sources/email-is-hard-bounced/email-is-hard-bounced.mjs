import common from "../common/webhook.mjs";
import { EmailWebhookEventType } from "mailersend";

export default {
  ...common,
  key: "mailersend-email-is-hard-bounced",
  name: "New Email Is Hard Bounced (Instant)",
  description: "Emit new event when your email is not delivered. [See the documentation](https://developers.mailersend.com/api/v1/webhooks.html#webhooks-overview)",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        EmailWebhookEventType.HARD_BOUNCED,
      ];
    },
  },
};
