const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "sendgrid-add-email-to-global-supression",
  name: "Add Email To Global Supression",
  description:
    "Allows you to add one or more email addresses to the global suppressions group.",
  version: "0.0.17",
  type: "action",
  props: {
    ...common.props,
    recipientEmails: {
      type: "string[]",
      label: "Recipient Emails",
      description:
        "An string array of email addresses to be added to the global suppressions group. Example `[\"email1@example.com\",\"email2@example.com\"]`",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const constraints = {
      recipientEmails: {
        presence: true,
        type: "array",
      },
    };
    const validationResult = validate(
      {
        recipientEmails: this.recipientEmails,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.sendgrid.addEmailToGlobalSupression(this.recipientEmails);
  },
};
