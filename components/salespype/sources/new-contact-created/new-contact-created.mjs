import common from "../common/base.mjs";

export default {
  ...common,
  key: "salespype-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created. [See the documentation](https://documenter.getpostman.com/view/5101444/2s93Y3u1Eb#e8b86665-e0b3-4c2e-9bd0-05fcf81f6c48)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.salespype.listContacts;
    },
    getResourceKey() {
      return "contacts";
    },
    getFieldValue(contact) {
      return Date.parse(contact.createdAt);
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `New Contact Created: ${contact.id}`,
        ts: Date.parse(contact.createdAt),
      };
    },
  },
};
