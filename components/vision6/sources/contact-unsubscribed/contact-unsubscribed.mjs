import common from "../common/base.mjs";

export default {
  ...common,
  key: "vision6-contact-unsubscribed",
  name: "Contact Unsubscribed",
  description: "Emit new event when a contact is unsubscribed",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents(limit) {
      const contacts = await this.getPaginatedContacts(this.list, {
        subscribed: false,
      });
      // create log of unsubscribedIds
      const unsubscribedIds = contacts.map((contact) => contact.id);
      this._setIds(unsubscribedIds);

      return contacts.slice(0, limit);
    },
    isSubscribed(contact) {
      return contact.subscribed.email || contact.subscribed.mobile;
    },
    isNewlyUnsubscribed(contact, unsubscribedIds) {
      return !this.isSubscribed(contact) && !unsubscribedIds.includes(contact.id);
    },
    isNewlySubscribed(contact, unsubscribedIds) {
      return this.isSubscribed(contact) && unsubscribedIds.includes(contact.id);
    },
    async getContacts(since) {
      const unsubscribedContacts = [];
      let unsubscribedIds = this._getIds();
      const contacts = await this.getPaginatedContacts(this.list, {
        ["last_modified_time:in"]: this.formatSinceDate(since),
      });
      for (const contact of contacts) {
        if (this.isNewlyUnsubscribed(contact, unsubscribedIds)) {
          unsubscribedIds.push(contact.id);
          unsubscribedContacts.push(contact);
        } else if (this.isNewlySubscribed(contact, unsubscribedIds)) {
          unsubscribedIds = unsubscribedIds.filter((id) => id !== contact.id);
        }
      }
      this._setIds(unsubscribedIds);
      return unsubscribedContacts;
    },
    generateMeta(contact) {
      const ts = Date.parse(contact.last_modified_time);
      return {
        id: `${contact.id}${ts}`,
        summary: `Unubscribed Contact ID: ${contact.id}`,
        ts,
      };
    },
  },
};
