import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "salesforge-email-replied-instant",
  name: "Email Reply Received (Instant)",
  description: "Emit new event when an email reply is received in Salesforge. [See the documentation](https://help.salesforge.ai/en/articles/8680365-how-to-use-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "email_replied";
    },
    getSummary({ sequenceEmail }) {
      return `Email reply received: "${sequenceEmail?.subject}"`;
    },
  },
};
