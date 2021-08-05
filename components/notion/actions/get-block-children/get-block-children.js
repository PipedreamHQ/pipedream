const notion = require("../../notion.app");

module.exports = {
  key: "notion-get-block-children",
  name: "Get Block Children",
  description:
    "Gets a list of child block objects contained in a block given its identifier.",
  version: "0.0.3",
  type: "action",
  props: {
    notion,
    blockId: {
      propDefinition: [
        notion,
        "blockId",
      ],
    },
    startCursor: {
      propDefinition: [
        notion,
        "startCursor",
      ],
    },
    pageSize: {
      propDefinition: [
        notion,
        "pageSize",
      ],
    },
  },
  async run() {
    if (!this.blockId) {
      throw new Error("Must provide blockId parameter.");
    }
    return await this.notion.getBlockChildren(
      this.blockId,
      this.startCursor,
      this.pageSize,
    );
  },
};
