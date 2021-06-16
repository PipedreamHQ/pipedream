const sendgrid = require("../../sendgrid.app");

module.exports = {
  key: "sendgrid-delete-blocks",
  name: "Delete Blocks",
  description: "Allows you to delete all email addresses on your blocks list.",
  version: "0.0.4",
  type: "action",
  props: {
    sendgrid,
    deleteAll: {
      type: "boolean",
      label: "Delete All",
      description:
        "Indicates if you want to delete all blocked email addresses.",
      optional: true,
    },
    emails: {
      type: "string",
      label: "Emails",
      description:
        'A JSON-based array of the specific blocked email addresses that you want to delete. Example: `["email1@example.com","email2@example.com"]`',
      optional: true,
    },
  },
  async run() {
    const deleteAll = !!this.deleteAll;
    const emails = this.emails ? JSON.parse(this.emails) : null;
    return await this.sendgrid.deleteBlocks(deleteAll, emails);
  },
};
