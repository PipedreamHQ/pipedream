import notion from "../../notion.app.mjs";

export default {
  key: "notion-retrieve-block",
  name: "Retrieve Block",
  description: "Retrieves a block. A block object represents content within Notion. Blocks can be text, lists, media, and more. A page is also a type of block. [See the docs](https://developers.notion.com/reference/retrieve-a-block)",
  version: "0.0.1",
  type: "action",
  props: {
    notion,
    blockId: {
      propDefinition: [
        notion,
        "pageId",
      ],
      label: "Block ID",
      description: "The identifier for a Notion block",
    },
    retrieveChildren: {
      type: "boolean",
      label: "Retrieve Block Children",
      description: "Returns recursively all the children for the block ID specified. [See docs](https://developers.notion.com/reference/get-block-children)",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const block = await this.notion.retrieveBlock(this.blockId);
    if (this.retrieveChildren) {
      block.children = await this.notion.retrieveBlockChildren(block);
    }
    $.export("$summary", "Retrieved block successfully");
    return block;
  },
};
