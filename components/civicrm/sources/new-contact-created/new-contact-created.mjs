import common from "../common/polling.mjs";

export default {
  ...common,
  key: "civicrm-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created. [See the documentation](https://docs.civicrm.org/dev/en/latest/api/v4/usage/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  methods: {
    ...common.methods,
    _getDateField() {
      return "created_date";
    },
    getResourceFn() {
      return this.app.getContacts;
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `New Contact: ${contact.id}`,
        ts: Date.parse(contact.created_date),
      };
    },
  },
};
