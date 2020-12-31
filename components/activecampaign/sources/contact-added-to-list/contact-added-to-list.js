const activecampaign = require("../../activecampaign.app.js");

module.exports = {
  name: "New Contact Added to List",
  key: "activecampaign-contact-added-to-list",
  description: "Emits an event each time a new contact is added to a list.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    activecampaign,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    async getContacts(limit, offset = 0) {
      let total = limit;
      let contacts = [];
      while (total == limit) {
        let results = (await this.activecampaign.listContacts(limit, offset))
          .contacts;
        contacts = contacts.concat(results);
        total = results.length;
        offset += limit;
      }
      return contacts;
    },
    async getContactLists(contactListUrl, limit, offset = 0) {
      let total = limit;
      let lists = [];
      while (total == limit) {
        let results = (
          await this.activecampaign.getContactLists(
            limit,
            offset,
            contactListUrl
          )
        ).contactLists;
        lists = lists.concat(results);
        total = results.length;
        offset += limit;
      }
      return lists;
    },
  },
  async run() {
    const limit = 100;
    const contacts = await this.getContacts(limit);
    for (const contact of contacts) {
      const contactListIds = this.db.get(contact.id) || [];
      const contactListUrl = contact.links.contactLists;
      const contactLists = await this.getContactLists(contactListUrl, limit);
      for (const contactList of contactLists) {
        if (contactListIds.includes(contactList.list)) continue;
        contactListIds.push(contactList.list);
        // get the list to emit
        const list = (await this.activecampaign.getList(contactList.list)).list;
        this.$emit(list, {
          id: `${contact.id}${list.id}`,
          summary: `${contact.email} added to ${list.name}`,
          ts: Date.now(),
        });
      }
      this.db.set(contact.id, contactListIds);
    }
  },
};