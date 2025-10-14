import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "salesforge-email-sent-instant",
  name: "Email Sent (Instant)",
  description: "Emit new event when an email is sent in Salesforge. [See the documentation](https://help.salesforge.ai/en/articles/8680365-how-to-use-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "email_sent";
    },
    getSummary({ sequenceEmail }) {
      return `Email sent: "${sequenceEmail?.subject}"`;
    },
  },
};
