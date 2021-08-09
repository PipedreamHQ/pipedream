const notion = require("../../notion.app");

module.exports = {
  key: "notion-get-all-users",
  name: "Get All Users",
  description: "Gets details of a user given its identifier.",
  version: "0.0.1",
  type: "action",
  props: {
    notion,
  },
  async run() {
    return await this.notion.getAllUsers();
  },
};
