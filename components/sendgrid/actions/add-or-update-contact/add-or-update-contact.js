const sendgrid = require("../../sendgrid.app");
const validate = require("validate.js");

module.exports = {
  key: "sendgrid-add-or-update-contact",
  name: "Add Or Update Contacts",
  description: "Adds or updates contacts.",
  version: "0.0.1",
  type: "action",
  props: {
    sendgrid,
    listIds: {
      type: "object",
      label: "List Ids",
      description:
        'An array of List ID strings that this contact(s) will be added to. Example:  `["49eeb4d9-0065-4f6a-a7d8-dfd039b77e0f","89876b28-a90e-41d1-b73b-e4a6ce2354ba"]`',
      optional: true,
    },
    contacts: {
      type: "object",
      label: "Contacts",
      description:
        'An array of one or more contacts objects that you intend to upsert. The `email` field is required for each Contact. Example `[{email:"email1@example.com",first_name:"Example 1"},{email:"email2@example.com",first_name:"Example 2"}]`',
    },
  },
  async run() {
    const constraints = {
      listIds: {
        type: "array",
      },
      contacts: {
        presence: true,
        type: "array",
      },
    };
    const validationResult = validate(
      { listIds: this.listIds, contacts: this.contacts },
      constraints,
      { format: 'flat' },
    );
    if (validationResult) {
      const validationErrorMsg = validationResult
        .map((errorMsg) => `\t${errorMsg}`)
        .join('\n');
      const errorMsg = `Parameter validation failed with the following errors:\n${validationErrorMsg}`;
      throw new Error(errorMsg);
    }
    return await this.sendgrid.addOrUpdateContacts({
      list_ids: this.listIds,
      contacts: this.contacts,
    });
  },
};
