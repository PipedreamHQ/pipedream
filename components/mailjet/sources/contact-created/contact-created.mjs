import common from "../common/base.mjs";

export default {
  ...common,
  key: "mailjet-contact-created",
  name: "Contact Created",
  description: "Emit new event when a contact is created. [See the docs here](https://dev.mailjet.com/email/reference/contacts/contact-list/#v3_get_contactslist)",
  type: "source",
  version: "0.0.5",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.mailjetApp.listContacts;
    },
    getResourceProperty() {
      return "CreatedAt";
    },
    getTimestamp(resource) {
      return Date.parse(resource.CreatedAt || new Date());
    },
    getModelName() {
      return "Contact";
    },
    getAction() {
      return "created";
    },
  },
};
