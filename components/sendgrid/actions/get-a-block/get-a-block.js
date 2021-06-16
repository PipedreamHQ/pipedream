const sendgrid = require("../../sendgrid.app");

module.exports = {
  key: "sendgrid-get-a-block",
  name: "Get a Block",
  description: "Gets a specific block.",
  version: "0.0.6",
  type: "action",
  props: {
    sendgrid,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the specific block.",
      useQuery: true,
      async options() {
        const options = [];
        const blocks = await this.sendgrid.listBlocks();
        for (const block of blocks) {
          options.push(block.email);
        }
        return options;
      },
    },
  },
  async run() {
    if (!this.email) {
      throw new Error("Must provide email parameter.");
    }
    return await this.sendgrid.getBlock(this.email);
  },
};
