import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "salesforge-contact-unsubscribed-instant",
  name: "Contact Unsubscribed (Instant)",
  description: "Emit new event when a contact unsubscribes in Salesforge. [See the documentation](https://help.salesforge.ai/en/articles/8680365-how-to-use-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "contact_unsubscribed";
    },
    getSummary({ contact }) {
      return `Contact unsubscribed: ${contact?.email || "unknown contact"}`;
    },
  },
};
