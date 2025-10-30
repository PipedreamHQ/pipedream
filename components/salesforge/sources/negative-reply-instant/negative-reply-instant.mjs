import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "salesforge-negative-reply-instant",
  name: "Negative Reply Received (Instant)",
  description: "Emit new event when a negative reply is received in Salesforge. [See the documentation](https://help.salesforge.ai/en/articles/8680365-how-to-use-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "negative_reply";
    },
    getSummary({ contact }) {
      return `Negative reply received from ${contact?.email || "unknown contact"}`;
    },
  },
};
