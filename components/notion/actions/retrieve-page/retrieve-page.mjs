import notion from "../../notion.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "notion-retrieve-page",
  name: "Get Page",
  description:
    "Retrieve a Notion page: both its property values **and** its body content rendered as Markdown."
    + " Use this to read what a page says or to inspect a database row's fields."
    + " Provide a page ID or a Notion page URL (use **Search** to resolve a page name into an ID)."
    + " [See the documentation](https://developers.notion.com/reference/retrieve-a-page)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    notion,
    pageId: {
      type: "string",
      label: "Page ID or URL",
      description: "The ID of the page (or its Notion URL). Use **Search** to resolve a page name into an ID.",
    },
  },
  async run({ $ }) {
    const pageId = utils.extractNotionId(this.pageId);

    const page = await this.notion.retrievePage(pageId);
    const content = await this.notion.getPageAsMarkdown(pageId, false);

    const title = this.notion.extractPageTitle(page);
    $.export("$summary", `Retrieved page${title
      ? ` "${title}"`
      : ""}`);

    return {
      page,
      content,
    };
  },
};
