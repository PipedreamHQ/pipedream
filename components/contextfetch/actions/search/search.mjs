import app from "../../contextfetch.app.mjs";

export default {
  key: "contextfetch-search",
  name: "Search",
  description: "Search the web and get results with page Markdown, highlights or pruned context. 1 credit per search. Use **Get Contents** to fetch pages you already have URLs for. [See the documentation](https://contextfetch.dev/docs)",
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
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    numResults: {
      type: "integer",
      label: "Max Results",
      description: "Max number of results to return",
      min: 1,
      max: 100,
      default: 5,
      optional: true,
    },
    text: {
      type: "boolean",
      label: "Full Text",
      description: "Whether to add the whole page as Markdown to each result",
      optional: true,
    },
    highlights: {
      type: "boolean",
      label: "Highlights",
      description: "Whether to add the page chunks most relevant to the query to each result",
      optional: true,
    },
    prunedContext: {
      type: "boolean",
      label: "Pruned Context",
      description: "Whether to add the relevant chunks joined in page order, to save tokens. With no page content selected, results have only title, URL and score.",
      default: true,
      optional: true,
    },
    includeDomains: {
      type: "string[]",
      label: "Include Domains",
      description: "Only return results from these domains, e.g. `docs.python.org`",
      optional: true,
    },
    excludeDomains: {
      type: "string[]",
      label: "Exclude Domains",
      description: "Leave results from these domains out, e.g. `pinterest.com`",
      optional: true,
    },
    startPublishedDate: {
      type: "string",
      label: "Published After",
      description: "Only return results published on or after this date (ISO 8601), e.g. `2026-01-01`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.search({
      $,
      data: {
        query: this.query,
        numResults: this.numResults,
        includeDomains: this.includeDomains,
        excludeDomains: this.excludeDomains,
        startPublishedDate: this.startPublishedDate,
        contents: {
          text: this.text ?? false,
          highlights: this.highlights ?? false,
          prunedContext: this.prunedContext ?? false,
        },
      },
    });
    $.export("$summary", `Found ${response.results?.length ?? 0} result(s)`);
    return response;
  },
};
