import common from "../common/base-new-created-resources.mjs";

export default {
  ...common,
  key: "corporate_merch-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.corporateMerch.listContacts;
    },
    getSummary(contact) {
      return `New Contact with ID: ${contact.id}`;
    },
  },
};
