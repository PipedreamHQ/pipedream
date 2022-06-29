import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-append-block",
  name: "Append Block to Parent",
  description: "Creates and appends new blocks to the specified parent. [See the docs](https://developers.notion.com/reference/patch-block-children)",
  version: "0.1.0",
  type: "action",
  props: {
    notion,
    pageId: {
      propDefinition: [
        notion,
        "pageId",
      ],
      label: "Parent Block ID",
      description: "The identifier for the parent block",
    },
    blockTypes: {
      propDefinition: [
        notion,
        "blockTypes",
      ],
    },
  },
  async additionalProps() {
    return this.buildAdditionalProps({
      blocks: this.blockTypes,
    });
  },
  async run({ $ }) {
    const blocks = this.createBlocks();
    const response = await this.notion.appendBlock(this.pageId, blocks);
    $.export("$summary", "Appended block(s) successfully");
    return response;
  },
};
