const common = require("../common");

module.exports = {
  ...common,
  key: "sendgrid-delete-contacts",
  name: "Delete Contacts",
  description: "Allows you to delete one or more contacts.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    deleteAllContacts: {
      type: "boolean",
      label: "Delete All Contacts?",
      description: "This parameter allows you to delete all of your contacts. This can not be used with the `ids` parameter.",
      default: false,
    },
    ids: {
      type: "string[]",
      label: "Contact ID's",
      description: "An array of contact IDs to delete",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const deleteAllContacts = !!(this.convertEmptyStringToUndefined(this.deleteAllContacts));
    if (deleteAllContacts && this.ids) {
      throw new Error(
        "Must provide only one of `deleteAllContacts` or `ids` parameters.",
      );
    }
    return this.sendgrid.deleteContacts(deleteAllContacts, this.ids);
  },
};
