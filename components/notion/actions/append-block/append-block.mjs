import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";
import { appendBlocks } from "notion-helper";

export default {
  ...base,
  key: "notion-append-block",
  name: "Append Block to Parent",
  description: "Append new and/or existing blocks to the specified parent. [See the documentation](https://developers.notion.com/reference/patch-block-children)",
  version: "0.4.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
          label: "Append existing blocks",
          value: "blockIds",
        },
        {
          label: "Provide Markdown content to create new blocks with",
          value: "markdownContents",
        },
        {
          label: "Provide Image URLs to create new image blocks",
          value: "imageUrls",
        },
      ],
    },
    blockIds: {
      propDefinition: [
        notion,
        "pageId",
      ],
      type: "string[]",
      label: "Existing Block IDs",
      description: "Select one or more block(s) or page(s) to append (selecting a page appends its children). You can also provide block or page IDs.",
      hidden: true,
    },
    markdownContents: {
      type: "string[]",
      label: "Markdown Contents",
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
      "blockIds",
      "markdownContents",
      "imageUrls",
    ]) {
      currentProps[prop].hidden = !blockTypes.includes(prop);
    }

    return {};
  },
  async run({ $ }) {
    const { blockTypes } = this;
    const children = [];

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
    if (blockTypes.includes("markdownContents") && this.markdownContents?.length > 0) {
      for (const content of this.markdownContents) {
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

    const response = await appendBlocks({
      client: await this.notion._getNotionClient(),
      block_id: this.pageId,
      children,
    });

    $.export("$summary", "Appended blocks successfully");
    return response.apiResponses;
  },
};
