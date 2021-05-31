const sendgrid = require("../../sendgrid.app");

module.exports = {
  key: "sendgrid-delete-contacts",
  name: "Delete Contacts",
  description: "Allows you to delete one or more contacts.",
  version: "0.0.7",
  type: "action",
  props: {
    sendgrid,
    deleteAllContacts: {
      type: "string",
      label: "Delete All Contacts?",
      description: "Must be set to `true` to delete all contacts.",
      optional: true,
    },
    ids: {
      type: "string",
      label: "Ids",
      description: "A comma-separated list of contact IDs to delete.",
      optional: true,
    },
  },
  async run() {
    return await this.sendgrid.deleteContacts(this.deleteAllContacts, this.ids);
  },
};
