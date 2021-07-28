const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "sendgrid-add-or-update-contact",
  name: "Add Or Update Contacts",
  description: "Adds or updates contacts.",
  version: "0.0.29",
  type: "action",
  props: {
    ...common.props,
    listIds: {
      type: "string[]",
      label: "List Ids",
      description:
        "A string array of List IDs where contact(s) will be added to. Example:  `[\"49eeb4d9-0065-4f6a-a7d8-dfd039b77e0f\",\"89876b28-a90e-41d1-b73b-e4a6ce2354ba\"]`",
      optional: true,
    },
    contacts: {
      type: "string",
      label: "Contacts",
      description:
        "Array of one or more contacts objects that you intend to upsert. Alternatively, provide string that will `JSON.parse()` to an array of objects. The `email` field is required for each Contact. Example `[{email:\"email1@example.com\",first_name:\"Example 1\"},{email:\"email2@example.com\",first_name:\"Example 2\"}]`",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const constraints = {
      contacts: {
        presence: true,
        length: {
          minimum: 1,
          maximum: 30000,
          tooShort: "parameter needs to have %{count} contacts or more",
          tooLong: "parameter needs to have %{count} contacts or less",
        },
        contactsValidator: this.contacts,
      },
    };
    const opts = {};
    if (this.listIds) {
      constraints.listIds = {
        type: "array",
      };
      opts.list_ids = this.listIds;
    }
    const arrayValidationMsg = "must be an array of %, or an string that will `JSON.parse` to an array of contacts.";
    validate.validators.contactsValidator = function (
      value,
    ) {
      if (Array.isArray(value)) {
        opts.contacts = value;
        return null;
      } else {
        try {
          opts.contacts = JSON.parse(value);
          return Array.isArray(opts.contacts) ?
            null :
            contactsValidationMsg;
        } catch {
          return contactsValidationMsg;
        }
      }
    };
    const validationResult = validate(
      {
        listIds: this.listIds,
        contacts: this.contacts,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.sendgrid.addOrUpdateContacts(opts);
  },
};
