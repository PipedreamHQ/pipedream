import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "omnisend-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event each time a new contact is created in Omnisend.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(contact) {
      return `New Contact with ID: ${contact.contactID}`;
    },
    getFunction() {
      return this.omnisend.listContacts;
    },
    getDataField() {
      return "contacts";
    },
  },
  sampleEmit,
};
