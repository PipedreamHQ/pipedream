import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-append-block",
  name: "Append Block to Parent",
  description: "Creates and appends blocks to the specified parent. [See the docs](https://developers.notion.com/reference/patch-block-children)",
  version: "0.2.3",
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
    blockIds: {
      propDefinition: [
        notion,
        "pageId",
      ],
      type: "string[]",
      label: "Block IDs",
      description: "Contents of selected blocks will be appended",
      optional: true,
    },
    pageContents: {
      type: "string[]",
      label: "Page Contents",
      description: "Content of new blocks to append. You can use Markdown syntax [See docs](https://www.notion.so/help/writing-and-editing-basics#markdown-&-shortcuts)",
      optional: true,
    },
  },
  async run({ $ }) {
    const blocks = [];
    if (this.blockIds?.length > 0) {
      for (const id of this.blockIds) {
        const block = await this.notion.retrieveBlock(id);
        const children = await this.notion.retrieveBlockChildren(block);
        blocks.push(...children
          .filter((child) => Object.keys(child[child.type]).length > 0 && child.type !== "child_page")
          .map((child) => ({
            object: "block",
            type: child.type,
            [child.type]: child[child.type],
          })));
      }
    }
    if (this.pageContents?.length > 0) {
      for (const content of this.pageContents) {
        const block = this.createBlocks(content);
        blocks.push(...block);
      }
    }
    const { results } = await this.notion.appendBlock(this.pageId, blocks);
    $.export("$summary", `Appended ${results.length} block(s) successfully`);
    return results;
  },
};
