const notion = require("../../notion.app");

module.exports = {
  key: "notion-get-database",
  name: "Get Database",
  description: "Gets details of a database given its identifier.",
  version: "0.0.2",
  type: "action",
  props: {
    notion,
    databaseId: {
      propDefinition: [
        notion,
        "databaseId",
      ],
      optional: true,
    },
  },
  async run() {
    if (!this.databaseId) {
      throw new Error("Must provide databaseId parameter.");
    }
    return await this.notion.getDatabase(this.databaseId);
  },
};
