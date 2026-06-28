import notion from "../../notion.app.mjs";
import utils from "../../common/utils.mjs";
import base from "../common/base-page-builder.mjs";

const MAX_BLOCKS = 100;

export default {
  ...base,
  key: "notion-append-block",
  name: "Append Block to Parent",
  description:
    "Append Markdown content to the bottom of a Notion page (or block)."
    + " The `content` is parsed from Markdown into Notion blocks — use it to add paragraphs, headings, bullet/numbered lists, to-dos, quotes, code, etc."
    + " Provide the page ID or URL (use **Search** to resolve a page name into an ID)."
    + " To change a database row's property values instead, use **Update Page**."
    + " [See the documentation](https://developers.notion.com/reference/patch-block-children)",
  version: "0.5.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    notion,
    pageId: {
      type: "string",
      label: "Page ID or URL",
      description: "The ID (or Notion URL) of the page/block to append content to. Use **Search** to resolve a page name into an ID.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The Markdown content to append. [Markdown reference](https://www.notion.com/help/writing-and-editing-basics#markdown-and-shortcuts).",
    },
  },
  async run({ $ }) {
    const pageId = utils.extractNotionId(this.pageId);
    const children = this.createBlocks(this.content);

    if (!children.length) {
      $.export("$summary", "Nothing to append");
      return;
    }

    const responses = [];
    let remaining = children;
    while (remaining.length > 0) {
      responses.push(await this.notion.appendBlock(pageId, remaining.slice(0, MAX_BLOCKS)));
      remaining = remaining.slice(MAX_BLOCKS);
    }

    $.export("$summary", `Appended ${children.length} block${children.length === 1
      ? ""
      : "s"} to the page`);
    return responses;
  },
};
