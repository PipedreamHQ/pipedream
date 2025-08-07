import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "salesforge-email-opened-instant",
  name: "Email Opened (Instant)",
  description: "Emit new event when an email is opened in Salesforge. [See the documentation](https://help.salesforge.ai/en/articles/8680365-how-to-use-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "email_opened";
    },
    getSummary({ sequenceEmail }) {
      return `Email opened: "${sequenceEmail?.subject}"`;
    },
  },
};
