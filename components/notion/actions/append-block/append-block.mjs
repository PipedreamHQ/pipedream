import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-append-block",
  name: "Append Block to Parent",
  description: "Creates and appends new blocks to the specified parent. [See the docs](https://developers.notion.com/reference/patch-block-children)",
  version: "0.2.1",
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
    pageContent: {
      type: "string",
      label: "Page Content",
      description: "Content of the page. You can use Markdown syntax [See docs](https://www.notion.so/help/writing-and-editing-basics#markdown-&-shortcuts)",
    },
  },
  async run({ $ }) {
    const blocks = this.createBlocks(this.pageContent);
    const response = await this.notion.appendBlock(this.pageId, blocks);
    $.export("$summary", "Appended block(s) successfully");
    return response;
  },
};
