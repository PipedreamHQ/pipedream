const sendgrid = require("../../sendgrid.app");

module.exports = {
  key: "sendgrid-get-all-recipients",
  name: "Get All Recipients",
  description: "Allows you to get all of your Marketing Campaigns recipients.",
  version: "0.0.5",
  type: "action",
  props: {
    sendgrid,
    page: {
      type: "integer",
      label: "Page",
      description: "Page index of first recipients to return (must be a positive integer)",
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description:
        "Number of recipients to return at a time (must be a positive integer between 1 and 1000)",
      optional: true,
    }
  },
  async run() {
    return await this.sendgrid.getAllRecipients(this.page,this.pageSize);
  },
};
