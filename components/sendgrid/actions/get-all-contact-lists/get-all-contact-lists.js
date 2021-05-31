const sendgrid = require("../../sendgrid.app");

module.exports = {
  key: "sendgrid-get-all-contact-lists",
  name: "Get All Contact Lists",
  description: "Allows you to get all of your contact lists.",
  version: "0.0.2",
  type: "action",
  props: {
    sendgrid,
    pageSize: {
      type: "integer",
      label: "Page Size",
      description:
        "Maximum number of elements to return. Defaults to 100, returns 1000 max.",
      optional: true,
    },
    pageToken: {
      type: "integer",
      label: "Page Token",
      description: "When doing pagination, the token of a page to retrieve.",
      optional: true,
    },
  },
  async run() {
    return await this.sendgrid.getAllContactLists(this.pageSize, this.pageToken);
  },
};
