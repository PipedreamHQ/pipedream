const sendgrid = require("../../sendgrid.app");

module.exports = {
  key: "sendgrid-add-email-to-global-supression",
  name: "Add Email To Global Supression",
  description:
    "Allows you to add one or more email addresses to the global suppressions group.",
  version: "0.0.7",
  type: "action",
  props: {
    sendgrid,
    recipientEmails: {
      type: "string",
      label: "Recipient Emails",
      description:
        'A JSON-based array of email addresses to be added to the global suppressions group. Example `["email1@example.com","email2@example.com"]`',
    },
  },
  async run() {
    if (!this.recipientEmails) {
      throw new Error("Must provide recipientEmails parameter.");
    }
    const recipientEmails = JSON.parse(this.recipientEmails);
    return await this.sendgrid.addEmailToGlobalSupression(recipientEmails);
  },
};
