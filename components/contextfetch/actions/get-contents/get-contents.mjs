import app from "../../contextfetch.app.mjs";

export default {
  key: "contextfetch-get-contents",
  name: "Get Contents",
  description: "Fetch one or more pages as Markdown. 1 credit per page that loads; URLs that fail are listed in `statuses`. Use **Search** to find pages first. [See the documentation](https://contextfetch.dev/docs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    urls: {
      propDefinition: [
        app,
        "urls",
      ],
    },
    text: {
      type: "boolean",
      label: "Full Text",
      description: "Whether to return each page as Markdown",
      default: true,
      optional: true,
    },
    highlightsQuery: {
      type: "string",
      label: "Highlights Query",
      description: "Return the page chunks most relevant to this query as highlights, e.g. `pricing`",
      optional: true,
    },
    prunedContext: {
      type: "boolean",
      label: "Pruned Context",
      description: "Whether to return the chunks relevant to **Highlights Query** joined in page order, to save tokens",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.getContents({
      $,
      data: {
        urls: this.urls,
        text: this.text ?? true,
        highlights: this.highlightsQuery
          ? {
            query: this.highlightsQuery,
          }
          : undefined,
        prunedContext: this.prunedContext,
      },
    });
    $.export("$summary", `Fetched ${response.results?.length ?? 0} of ${this.urls.length} page(s)`);
    return response;
  },
};
