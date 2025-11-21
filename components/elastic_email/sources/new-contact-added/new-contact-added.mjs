import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "elastic_email-new-contact-added",
  name: "New Contact Added",
  description: "Emit new event when a new contact is added to a mailing list. [See the documentation](https://elasticemail.com/developers/api-documentation/rest-api#operation/contactsGet)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.app.listContacts;
    },
    getDateField() {
      return "DateAdded";
    },
    getIdField() {
      return "Email";
    },
    getSummary(item) {
      return `New contact added: ${item.Email}`;
    },
  },
  sampleEmit,
};
