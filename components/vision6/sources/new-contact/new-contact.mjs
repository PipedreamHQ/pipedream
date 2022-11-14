import common from "../common/base.mjs";

export default {
  ...common,
  key: "vision6-new-contact",
  name: "New Contact",
  description: "Emit new event when a new contact is added",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents(limit) {
      const { _embedded: { contacts } } = await this.vision6.listContacts(this.list, {
        limit,
      });
      return contacts;
    },
    async getContacts(since = null) {
      return this.getPaginatedContacts(this.list, {
        ["creation_time:in"]: this.formatSinceDate(since),
      });
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `New Contact ID: ${contact.id}`,
        ts: Date.parse(contact.creation_time),
      };
    },
  },
};
