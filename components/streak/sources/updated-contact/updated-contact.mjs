import common from "../common/team-based.mjs";

export default {
  ...common,
  key: "streak-updated-contact",
  name: "Updated Contact (Instant)",
  description: "Emit new event when a contact is updated within a team.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents(limit) {
      return this.getContactsInPipeline(limit);
    },
    getEventType() {
      return "CONTACT_UPDATE";
    },
    generateMeta(contact) {
      return {
        id: contact.lastSavedTimestamp,
        summary: contact.emailAddresses[0],
        ts: contact.lastSavedTimestamp,
      };
    },
  },
};
