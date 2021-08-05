const notion = require("../../notion.app");

module.exports = {
  key: "notion-get-page",
  name: "Get Page",
  description: "Gets details of a page given its identifier.",
  version: "0.0.2",
  type: "action",
  props: {
    notion,
    pageId: {
      propDefinition: [
        notion,
        "pageId",
      ],
    },
  },
  async run() {
    if (!this.pageId) {
      throw new Error("Must provide pageId parameter.");
    }
    return await this.notion.getPage(this.pageId);
  },
};
