import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "salesforge-email-bounced-instant",
  name: "Email Bounced (Instant)",
  description: "Emit new event when an email bounces in Salesforge. [See the documentation](https://help.salesforge.ai/en/articles/8680365-how-to-use-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "email_bounced";
    },
    getSummary({ contact }) {
      return `Email bounced to ${contact?.email || "unknown recipient"}`;
    },
  },
};
