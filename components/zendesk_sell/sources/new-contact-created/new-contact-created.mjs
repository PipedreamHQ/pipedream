import common from "../common/base.mjs";

export default {
  ...common,
  key: "zendesk_sell-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created in Zendesk Sell.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zendeskSell.listContacts;
    },
    getSummary(contact) {
      return `New Contact ID: ${contact.id}`;
    },
  },
};
