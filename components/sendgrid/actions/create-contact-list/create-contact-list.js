const sendgrid = require("../../sendgrid.app");

module.exports = {
  key: "sendgrid-create-contact-list",
  name: "Create Contact List",
  description: "Allows you to create a new contact list.",
  version: "0.0.5",
  type: "action",
  props: {
    sendgrid,
    name: {
      type: "string",
      label: "Name",
      description: "Your name for your list. maxLength: 100",
    },
  },
  async run() {
    if (!this.name) {
      throw new Error("Must provide name parameter.");
    }
    return await this.sendgrid.createContactList(this.name);
  },
};
