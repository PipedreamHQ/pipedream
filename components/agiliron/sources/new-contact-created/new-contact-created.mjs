import constants from "../../common/constants.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "agiliron-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created in Agiliron. [See the documentation](https://api.agiliron.com/docs/read-contact-1)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFields() {
      return {
        date: "CreatedTime",
        id: "ContactId",
        ...constants.TYPE_FIELDS.Contacts,
      };
    },
    getFunction() {
      return this.agiliron.getContacts;
    },
    getSummary(contact) {
      return `New contact: ${contact.FirstName} ${contact.LastName}`;
    },
  },
  sampleEmit,
};
