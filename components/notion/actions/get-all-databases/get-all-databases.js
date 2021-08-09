const notion = require("../../notion.app");

module.exports = {
  key: "notion-get-all-databases",
  name: "Get All Databases",
  description: "Gets all databses shared with the connected Notion account.",
  version: "0.0.1",
  type: "action",
  props: {
    notion,
  },
  async run() {
    return await this.notion.getAllDatabases();
  },
};
