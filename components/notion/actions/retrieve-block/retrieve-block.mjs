import notion from "../../notion.app.mjs";

export default {
  key: "notion-retrieve-block",
  name: "Retrieve Page Content",
  description: "Get page content as block objects or markdown. Blocks can be text, lists, media, a page, among others. [See the documentation](https://developers.notion.com/reference/retrieve-a-block)",
  version: "0.2.0",
  type: "action",
  props: {
    notion,
    blockId: {
      propDefinition: [
        notion,
        "pageId",
      ],
    },
    retrieveChildren: {
      type: "string",
      label: "Retrieve Children",
      description: "Retrieve all the children (recursively) for the specified page, or optionally filter to include only sub-pages in the result. [See the documentation](https://developers.notion.com/reference/get-block-children) for more information",
      optional: true,
      options: [
        "All Children",
        "Sub-Pages Only",
        "None",
      ],
    },
    retrieveMarkdown: {
      type: "boolean",
      label: "Retrieve as Markdown",
      description: "Additionally return the page content as markdown",
      optional: true,
    },
  },
  async run({ $ }) {
    let markdownContent;
    if (this.retrieveMarkdown) {
      markdownContent = await this.notion.getPageAsMarkdown(this.blockId);
    }

    const { retrieveChildren } = this;
    const subpagesOnly = retrieveChildren === "Sub-Pages Only";

    const block = await this.notion.retrieveBlock(this.blockId);
    if ([
      true,
      "All Children",
      "Sub-Pages Only",
    ].includes(retrieveChildren)) {
      block.children = await this.notion.retrieveBlockChildren(block, subpagesOnly);
    }
    $.export("$summary", `Successfully retrieved block${retrieveChildren
      ? ` with ${block.children.length ?? 0} ${subpagesOnly
        ? "sub-pages"
        : "children"}`
      : ""}`);
    return markdownContent
      ? {
        markdownContent,
        block,
      }
      : block;
  },
};
