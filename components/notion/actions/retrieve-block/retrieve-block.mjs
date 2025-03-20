import notion from "../../notion.app.mjs";

export default {
  key: "notion-retrieve-block",
  name: "Retrieve Block",
  description: "Get details of a block, which can be text, lists, media, a page, among others. [See the documentation](https://developers.notion.com/reference/retrieve-a-block)",
  version: "0.0.6",
  type: "action",
  props: {
    notion,
    blockId: {
      propDefinition: [
        notion,
        "pageId",
      ],
      label: "Block ID",
      description: "Select a block or provide a block ID",
    },
    retrieveChildren: {
      type: "boolean",
      label: "Retrieve Children",
      description: "Retrieve all the children (recursively) for the specified block. [See the documentation](https://developers.notion.com/reference/get-block-children) for more information",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const block = await this.notion.retrieveBlock(this.blockId);
    if (this.retrieveChildren) {
      block.children = await this.notion.retrieveBlockChildren(block);
    }
    $.export("$summary", `Successfully retrieved block${this.retrieveChildren
      ? ` with ${block.children.length ?? 0} children`
      : ""}`);
    return block;
  },
};
