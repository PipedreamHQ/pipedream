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
      description: "This parameter allows you to delete all of your contacts. This can not be used with the `Ids` parameter.",
      default: false,
    },
    ids: {
      type: "string",
      label: "Contact ID's",
      description: "An array of contact IDs to delete",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const constraints = {
      ids: {
        type: "array",
      },
    };
    const validationResults = validate(this, constraints);
    this.checkValidationResults(validationResults);
    await this.sendgrid.deleteContacts(this.ids, this.deleteAllContacts);
  },
};
