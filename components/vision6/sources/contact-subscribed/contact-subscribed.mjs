import common from "../common/base.mjs";

export default {
  ...common,
  key: "vision6-contact-subscribed",
  name: "Contact Subscribed",
  description: "Emit new event when a contact is subscribed",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents(limit) {
      const contacts = await this.getPaginatedContacts(this.list, {
        subscribed: true,
      });
      // create log of subscribedIds
      const subscribedIds = contacts.map((contact) => contact.id);
      this._setIds(subscribedIds);

      return contacts.slice(0, limit);
    },
    isSubscribed(contact) {
      return contact.subscribed.email || contact.subscribed.mobile;
    },
    isNewlySubscribed(contact, subscribedIds) {
      return this.isSubscribed(contact) && !subscribedIds.includes(contact.id);
    },
    isNewlyUnsubscribed(contact, subscribedIds) {
      return !this.isSubscribed(contact) && subscribedIds.includes(contact.id);
    },
    async getContacts(since) {
      const subscribedContacts = [];
      let subscribedIds = this._getIds();
      const contacts = await this.getPaginatedContacts(this.list, {
        ["last_modified_time:in"]: this.formatSinceDate(since),
      });
      for (const contact of contacts) {
        if (this.isNewlySubscribed(contact, subscribedIds)) {
          subscribedIds.push(contact.id);
          subscribedContacts.push(contact);
        } else if (this.isNewlyUnsubscribed(contact, subscribedIds)) {
          subscribedIds = subscribedIds.filter((id) => id !== contact.id);
        }
      }
      this._setIds(subscribedIds);
      return subscribedContacts;
    },
    generateMeta(contact) {
      const ts = Date.parse(contact.last_modified_time);
      return {
        id: `${contact.id}${ts}`,
        summary: `Subscribed Contact ID: ${contact.id}`,
        ts,
      };
    },
  },
};
