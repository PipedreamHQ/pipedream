const notion = require("../../notion.app");

module.exports = {
  key: "notion-update-page-properties",
  name: "Update Page Properties",
  description: "Updates the property values of the specified page.",
  version: "0.0.5",
  type: "action",
  props: {
    notion,
    pageId: {
      propDefinition: [
        notion,
        "pageId",
      ],
    },
    properties: {
      propDefinition: [
        notion,
        "properties",
      ],
    },
  },
  async run() {
    if (!this.pageId || !this.properties) {
      throw new Error("Must provide pageId and properties parameters.");
    }
    return await this.notion.updatePageProperties(this.pageId, this.properties);
  },
};
