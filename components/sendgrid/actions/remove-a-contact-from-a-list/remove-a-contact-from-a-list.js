const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "sendgrid-remove-a-contact-from-a-list",
  name: "Remove A Contact From A List",
  description: "Allows you to remove contacts from a given list.",
  version: "0.0.32",
  type: "action",
  props: {
    ...common.props,
    id: {
      type: "string",
      label: "Id",
      description:
        "Unique Id of the List where the contact to remove off is located.",
    },
    contactIds: {
      type: "string[]",
      label: "Contact Ids",
      description:
        "String array of contact ids to be removed off the list.",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const constraints = {
      id: {
        presence: true,
      },
      contactIds: {
        presence: true,
        type: "array",
      },
    };
    const validationResult = validate(
      {
        id: this.id,
        contactIds: this.contactIds,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.sendgrid.removeContactFromList(this.id, this.contactIds);
  },
};
