const sendgrid = require("../../sendgrid.app");

module.exports = {
  key: "sendgrid-delete-global-supression",
  name: "Delete Global Supression",
  description:
    "Allows you to remove an email address from the global suppressions group.",
  version: "0.0.9",
  type: "action",
  props: {
    sendgrid,
    email: {
      type: "string",
      label: "Email",
      description:
        "The email address you want to remove from the global suppressions group.",
      useQuery: true,
      async options() {
        const options = [];
        const globalSupressions = await this.sendgrid.listGlobalSupressions();
        for (const globalSupression of globalSupressions) {
          options.push(globalSupression.email);
        }
        return options;
      },
    },
  },
  async run() {
    return await this.sendgrid.deleteGlobalSupression(this.email);
  },
};
