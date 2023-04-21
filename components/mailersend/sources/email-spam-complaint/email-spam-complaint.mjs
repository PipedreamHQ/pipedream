import common from "../common/webhook.mjs";
import { EmailWebhookEventType } from "mailersend";

export default {
  ...common,
  key: "mailersend-email-spam-complaint",
  name: "New Email Spam Complaint (Instant)",
  description: "Emit new event when the recipient marks your emails as spam or junk. [See the documentation](https://developers.mailersend.com/api/v1/webhooks.html#webhooks-overview)",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        EmailWebhookEventType.SPAM_COMPLIANT,
      ];
    },
  },
};
