import common from "../common/team-based.mjs";

export default {
  ...common,
  key: "streak-new-contact",
  name: "New Contact (Instant)",
  description: "Emit new event when a new contact is created within a team.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents(limit) {
      return this.getContactsInPipeline(limit);
    },
    getEventType() {
      return "CONTACT_CREATE";
    },
    generateMeta(contact) {
      return {
        id: this.shortenKey(contact.key),
        summary: contact.emailAddresses[0],
        ts: contact.creationDate,
      };
    },
  },
};
