import common from "../common/team-based.mjs";

export default {
  ...common,
  key: "streak-new-contact",
  name: "New Contact (Instant)",
  description: "Emit new event when a new contact is created within a team.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    ...common.hooks,
    async deploy() {
      const contacts = await this.streak.listContacts({
        teamId: this.teamId,
      });
      if (!contacts || contacts.length === 0) {
        return;
      }
      for (const contact of contacts) {
        this.$emit(contact, {
          id: contact.userKey,
          summary: contact.email,
          ts: Date.now(),
        });
      }
    },
  },
  methods: {
    ...common.methods,
    getEventType() {
      return "CONTACT_CREATE";
    },
    generateMeta(contact) {
      return {
        id: contact.key.slice(-72),
        summary: contact.emailAddresses[0],
        ts: contact.creationDate,
      };
    },
  },
};
