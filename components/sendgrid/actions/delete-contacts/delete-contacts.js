const validate = require("validate.js");
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
    if (this.ids) {
      const constraints = {
        ids: {
          type: "array",
        },
      };
      const validationResult = validate({
        ids: this.ids,
      }, constraints);
      this.checkValidationResults(validationResult);
    }
    if (this.deleteAllContacts && this.ids) {
      throw new Error(
        "Must provide only one of `deleteAllContacts` or `ids` parameters.",
      );
    }
    const deleteAll = !!this.deleteAllContacts;
    await this.sendgrid.deleteContacts(deleteAll, this.ids);
  },
};
