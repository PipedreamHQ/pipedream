import olostep from "../../olostep.app.mjs";

export default {
  key: "olostep-search-web",
  name: "Search Web",
  description: "Search the live web and get result titles, URLs and descriptions, optionally with each page's content as Markdown. [See the documentation](https://docs.olostep.com/api-reference/searches/create)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    olostep,
    query: {
      type: "string",
      label: "Query",
      description: "The search query in natural language, e.g. `best vector databases for RAG`",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results, from 1 to 25. Defaults to 12.",
      optional: true,
      min: 1,
      max: 25,
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
      description: "Never return results from these domains, e.g. `reddit.com`",
      optional: true,
    },
    scrapeResults: {
      type: "boolean",
      label: "Scrape Results",
      description: "Also scrape each result and include its content as Markdown. Uses extra credits per page.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.olostep.search({
      $,
      data: {
        query: this.query,
        limit: this.limit,
        include_domains: this.includeDomains,
        exclude_domains: this.excludeDomains,
        scrape_options: this.scrapeResults
          ? {
            formats: [
              "markdown",
            ],
          }
          : undefined,
      },
    });
    const count = response?.result?.links?.length ?? 0;
    $.export("$summary", `Found ${count} result${count === 1
      ? ""
      : "s"} for "${this.query}"`);
    return response;
  },
};
