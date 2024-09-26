import common from "../common/base.mjs";

export default {
  ...common,
  key: "vision6-contact-activated",
  name: "Contact Activated",
  description: "Emit new event when a contact is activated",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents(limit) {
      const contacts = await this.getPaginatedContacts(this.list, {
        is_active: true,
      });
      // create log of activeIds
      const activeIds = contacts.map((contact) => contact.id);
      this._setIds(activeIds);

      return contacts.slice(0, limit);
    },
    isNewlyActivated(contact, activeIds) {
      return contact.is_active && !activeIds.includes(contact.id);
    },
    isNewlyDeactivated(contact, activeIds) {
      return !contact.is_active && activeIds.includes(contact.id);
    },
    async getContacts(since) {
      const activatedContacts = [];
      let activeIds = this._getIds();
      const contacts = await this.getPaginatedContacts(this.list, {
        ["last_modified_time:in"]: this.formatSinceDate(since),
      });
      for (const contact of contacts) {
        if (this.isNewlyActivated(contact, activeIds)) {
          activeIds.push(contact.id);
          activatedContacts.push(contact);
        } else if (this.isNewlyDeactivated(contact, activeIds)) {
          activeIds = activeIds.filter((id) => id !== contact.id);
        }
      }
      this._setIds(activeIds);
      return activatedContacts;
    },
    generateMeta(contact) {
      const ts = Date.parse(contact.last_modified_time);
      return {
        id: `${contact.id}${ts}`,
        summary: `Activated Contact ID: ${contact.id}`,
        ts,
      };
    },
  },
};
