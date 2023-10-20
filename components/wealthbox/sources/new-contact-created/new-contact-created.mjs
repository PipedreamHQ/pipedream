import common from "../common/common.mjs";

export default {
  ...common,
  key: "wealthbox-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event for each contact created. [See the documentation](http://dev.wealthbox.com/#contacts-retrieve-all-contacts-get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getEvents({ params }) {
      params = {
        ...params,
        order: "created",
      };
      const { contacts } = await this.wealthbox.listContacts({
        params,
      });
      return contacts;
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `New Contact - ${contact.name}`,
        ts: this.getCreatedAtTs(contact),
      };
    },
  },
};
