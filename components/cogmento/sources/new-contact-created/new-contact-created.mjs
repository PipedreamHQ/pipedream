import common from "../common/base.mjs";

export default {
  ...common,
  key: "cogmento-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is added in Cogmento. [See the documentation](https://api.cogmento.com/static/swagger/index.html#/Contacts/get_contacts_)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.cogmento.listContacts;
    },
    getSummary(item) {
      return `New Contact Created: ${item.name}`;
    },
  },
};
