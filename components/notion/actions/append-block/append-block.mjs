import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-append-block",
  name: "Append Block to Parent",
  description:
    "Append new and/or existing blocks to the specified parent. [See the documentation](https://developers.notion.com/reference/patch-block-children)",
  version: "0.3.0",
  type: "action",
  props: {
    notion,
    pageId: {
      propDefinition: [
        notion,
        "pageId",
      ],
      label: "Parent Block ID",
      description: "Select a parent block/page or provide its ID",
    },
    blockTypes: {
      type: "string[]",
      label: "Block Type(s)",
      description: "Select which type(s) of block you'd like to append",
      reloadProps: true,
      options: [
        {
          label:
            "Use objects of existing blocks (e.g. objects returned from previous steps)",
          value: "blockObjects",
        },
        {
          label: "Select existing blocks or provide their IDs",
          value: "blockIds",
        },
        {
          label: "Provide Markdown content to create new blocks with",
          value: "markupContents",
        },
        {
          label: "Provide Image URLs to create new image blocks",
          value: "imageUrls",
        },
      ],
    },
    blockObjects: {
      type: "string[]",
      label: "Block Objects",
      description:
        "An array of block objects to be appended. You can use a custom expression to reference block objects from previous steps. [See the documentation](https://developers.notion.com/reference/block) for more information",
      hidden: true,
    },
    blockIds: {
      propDefinition: [
        notion,
        "pageId",
      ],
      type: "string[]",
      label: "Block IDs",
      description: "Select one or more block(s) or page(s) to append (selecting a page appends its children). You can also provide block or page IDs.",
      hidden: true,
    },
    markupContents: {
      type: "string[]",
      label: "Markup Contents",
      description:
        "Each entry is the content of a new block to append, using Markdown syntax. [See the documentation](https://www.notion.com/help/writing-and-editing-basics#markdown-and-shortcuts) for more information",
      hidden: true,
    },
    imageUrls: {
      type: "string[]",
      label: "Image URLs",
      description: "One or more Image URLs to append new image blocks with. [See the documentation](https://www.notion.com/help/images-files-and-media#media-block-types) for more information",
      hidden: true,
    },
  },
  additionalProps(currentProps) {
    const { blockTypes } = this;

    for (let prop of [
      "blockObjects",
      "blockIds",
      "markupContents",
      "imageUrls",
    ]) {
      currentProps[prop].hidden = !blockTypes.includes(prop);
    }

    return {};
  },
  methods: {
    ...base.methods,
    chunkArray(array, chunkSize = 100) {
      const chunks = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
      }
      return chunks;
    },
  },
  async run({ $ }) {
    const { blockTypes } = this;
    const children = [];
    // add blocks from blockObjects
    if (blockTypes.includes("blockObjects") && this.blockObjects?.length > 0) {
      for (const obj of this.blockObjects) {
        const child = typeof obj === "string"
          ? JSON.parse(obj)
          : obj;
        children.push(child);
      }
    }

    // add blocks from blockIds
    if (blockTypes.includes("blockIds") && this.blockIds?.length > 0) {
      for (const id of this.blockIds) {
        const block = await this.notion.retrieveBlock(id);
        block.children = await this.notion.retrieveBlockChildren(block);
        const formattedChildren = await this.formatChildBlocks(block);
        children.push(...formattedChildren);
      }
    }

    // add blocks from markup
    if (blockTypes.includes("markupContents") && this.markupContents?.length > 0) {
      for (const content of this.markupContents) {
        const block = this.createBlocks(content);
        children.push(...block);
      }
    }

    // add image blocks
    if (blockTypes.includes("imageUrls") && this.imageUrls?.length) {
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
      const { results: payload } = await this.notion.appendBlock(
        this.pageId,
        chunk,
      );
      results.push(payload);
    }

    const totalAppended = results.reduce((sum, res) => sum + res.length, 0);

    $.export("$summary", `Appended ${totalAppended} block(s) successfully`);
    return results.flat();
  },
};
