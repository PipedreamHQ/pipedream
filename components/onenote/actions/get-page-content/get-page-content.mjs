import TurndownService from "turndown";
import app from "../../onenote.app.mjs";

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

export default {
  key: "onenote-get-page-content",
  name: "Get Page Content",
  description: "Retrieve the body content of a OneNote page as HTML or Markdown."
    + " Use **Get Page** for the page's metadata (title, parent section, URLs, timestamps); use this action when you need the actual page content."
    + " Use **Search Pages** first to resolve a page name to a `pageId`."
    + " Set `convertToMarkdown` to `true` for cleaner, more compact output (recommended when the consumer is an LLM)."
    + " Set `includeIDs` to `true` if you need element IDs for a later update operation. Note: combining `includeIDs` with `convertToMarkdown` may strip `data-id` attributes during conversion."
    + " [See the documentation](https://learn.microsoft.com/en-us/graph/api/page-get?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    pageId: {
      propDefinition: [
        app,
        "pageId",
      ],
    },
    includeIDs: {
      type: "boolean",
      label: "Include Element IDs",
      description: "When true, the returned HTML includes `data-id` attributes on elements. Required for later update operations targeting specific elements on the page. Default false.",
      optional: true,
      default: false,
    },
    convertToMarkdown: {
      type: "boolean",
      label: "Convert to Markdown",
      description: "When true, the HTML content is converted to Markdown before being returned. Recommended when the consumer is an LLM. Default false (returns raw HTML).",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const html = await this.app.getPageContent({
      $,
      pageId: this.pageId,
      includeIDs: this.includeIDs,
    });

    if (this.convertToMarkdown) {
      const markdown = turndownService.turndown(html);
      $.export("$summary", `Retrieved page ${this.pageId} content as Markdown (${markdown.length} chars)`);
      return markdown;
    }

    $.export("$summary", `Retrieved page ${this.pageId} content as HTML (${html.length} chars)`);
    return html;
  },
};
