const sendgrid = require("../../sendgrid.app");

module.exports = {
  key: "sendgrid-get-a-global-supression",
  name: "Get A Global Supression",
  description: "Gets a global supression.",
  version: "0.0.6",
  type: "action",
  props: {
    sendgrid,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the global suppression you want to retrieve.",
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
    if (!this.email) {
      throw new Error("Must provide email parameter.");
    }
    return await this.sendgrid.getGlobalSupression(this.email);
  },
};
