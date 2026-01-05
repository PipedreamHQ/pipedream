import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "easybroker-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created. [See the documentation](https://dev.easybroker.com/reference/get_contacts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async processEvents(max) {
      const lastCreated = this._getLastCreated();
      let maxCreated = lastCreated;
      let page = 1;
      let contacts = [];
      let hasMore = true;

      do {
        const {
          content, pagination,
        } = await this.easybroker.listContacts({
          params: {
            page,
            limit: 50,
          },
        });
        for (const contact of content) {
          if (!lastCreated || Date.parse(contact.created_at) > Date.parse(lastCreated)) {
            contacts.push(contact);
            if (!maxCreated || Date.parse(contact.created_at) > Date.parse(maxCreated)) {
              maxCreated = contact.created_at;
            }
          }
        }
        hasMore = pagination.next_page !== null;
        page++;
      } while (hasMore);

      if (maxCreated) {
        this._setLastCreated(maxCreated);
      }

      if (max && contacts.length >= max) {
        contacts = contacts.slice(-1 * max);
      }

      for (const contact of contacts) {
        this.$emit(contact, this.generateMeta(contact));
      }
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `New Contact: ${contact.full_name}`,
        ts: Date.parse(contact.created_at),
      };
    },
  },
};
