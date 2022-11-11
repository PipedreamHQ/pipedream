import common from "../common/base.mjs";

export default {
  ...common,
  key: "vision6-contact-updated",
  name: "Contact Updated",
  description: "Emit new event when a contact is updated",
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
    async getContacts(since) {
      return this.getPaginatedContacts(this.list, {
        ["last_modified_time:in"]: this.formatSinceDate(since),
      });
    },
    generateMeta(contact) {
      const ts = Date.parse(contact.last_modified_time);
      return {
        id: `${contact.id}${ts}`,
        summary: `Updated Contact ID: ${contact.id}`,
        ts,
      };
    },
  },
};
