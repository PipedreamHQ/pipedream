import common from "../common/base.mjs";

export default {
  ...common,
  key: "vision6-contact-deactivated",
  name: "Contact Deactivated",
  description: "Emit new event when a contact is deactivated",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents(limit) {
      const contacts = await this.getPaginatedContacts(this.list, {
        is_active: false,
      });
      // create log of inactiveIds
      const inactiveIds = contacts.map((contact) => contact.id);
      this._setIds(inactiveIds);

      return contacts.slice(0, limit);
    },
    isNewlyDeactivated(contact, inactiveIds) {
      return !contact.is_active && !inactiveIds.includes(contact.id);
    },
    isNewlyActivated(contact, inactiveIds) {
      return !contact.is_active && inactiveIds.includes(contact.id);
    },
    async getContacts(since) {
      const deactivatedContacts = [];
      let inactiveIds = this._getIds();
      const contacts = await this.getPaginatedContacts(this.list, {
        ["last_modified_time:in"]: this.formatSinceDate(since),
      });
      for (const contact of contacts) {
        if (this.isNewlyDeactivated(contact, inactiveIds)) {
          inactiveIds.push(contact.id);
          deactivatedContacts.push(contact);
        } else if (this.isNewlyActivated(contact, inactiveIds)) {
          inactiveIds = inactiveIds.filter((id) => id !== contact.id);
        }
      }
      this._setIds(inactiveIds);
      return deactivatedContacts;
    },
    generateMeta(contact) {
      const ts = Date.parse(contact.last_modified_time);
      return {
        id: `${contact.id}${ts}`,
        summary: `Deactivated Contact ID: ${contact.id}`,
        ts,
      };
    },
  },
};
