import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-append-block",
  name: "Append Block to Parent",
  description: "Creates and appends blocks to the specified parent. [See the documentation](https://developers.notion.com/reference/patch-block-children)",
  version: "0.2.14",
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
    blockObjects: {
      type: "string[]",
      label: "Block Objects",
      description: "This prop accepts an array of block objects to be appended. Using a custom expression in this prop is recommended.",
      optional: true,
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
    markupContents: {
      type: "string[]",
      label: "Markup Contents",
      description: "Content of new blocks to append. You must use Markdown syntax [See docs](https://www.notion.so/help/writing-and-editing-basics#markdown-&-shortcuts)",
      optional: true,
    },
    imageUrls: {
      type: "string[]",
      label: "Image URLs",
      description: "List of URLs to append as image blocks",
      optional: true,
    },
  },
  methods: {
    chunkArray(array, chunkSize = 100) {
      const chunks = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
      }
      return chunks;
    },
  },
  async run({ $ }) {
    const children = [];
    // add blocks from blockObjects
    if (this.blockObjects?.length > 0) {
      for (const obj of this.blockObjects) {
        const child = (typeof obj === "string")
          ? JSON.parse(obj)
          : obj;
        children.push(child);
      }
    }

    // add blocks from blockIds
    if (this.blockIds?.length > 0) {
      for (const id of this.blockIds) {
        const block = await this.notion.retrieveBlock(id);
        block.children = await this.notion.retrieveBlockChildren(block);
        const formattedChildren = await this.formatChildBlocks(block);
        children.push(...formattedChildren);
      }
    }

    // add blocks from markup
    if (this.markupContents?.length > 0) {
      for (const content of this.markupContents) {
        const block = this.createBlocks(content);
        children.push(...block);
      }
    }

    // add image blocks
    if (this.imageUrls?.length) {
      for (const url of this.imageUrls) {
        children.push({
          type: "image",
          image: {
            type: "external",
            external: {
              url,
            },
          },
        });
      }
    }

    if (children.length === 0) {
      $.export("$summary", "Nothing to append");
      return;
    }

    const results = [];
    const chunks = this.chunkArray(children);

    for (const chunk of chunks) {
      const { results: payload } = await this.notion.appendBlock(this.pageId, chunk);
      results.push(payload);
    }

    const totalAppended = results.reduce((sum, res) => sum + res.length, 0);

    $.export("$summary", `Appended ${totalAppended} block(s) successfully`);
    return results.flat();
  },
};
