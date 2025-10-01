import firecrawl from "../../firecrawl.app.mjs";

export default {
  key: "firecrawl-search",
  name: "Search",
  description: "Search the web and get full content from results. [See the documentation](https://docs.firecrawl.dev/features/search)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    firecrawl,
    query: {
      type: "string",
      label: "Query",
      description: "The query to search for",
    },
    scrapeOptionFormats: {
      type: "string[]",
      label: "Scrape Option Formats",
      description: "Search with content scraping. You can specify multiple output formats.",
      options: [
        {
          label: "Clean, formatted markdown content",
          value: "markdown",
        },
        {
          label: "Processed HTML content",
          value: "html",
        },
        {
          label: "Unmodified HTML content",
          value: "rawHtml",
        },
        {
          label: "List of links found on the page",
          value: "links",
        },
        {
          label: "Screenshot of the page",
          value: "screenshot",
        },
        {
          label: "Full-page screenshot",
          value: "screenshot@fullPage",
        },
        {
          label: "Structured data extraction",
          value: "extract",
        },
      ],
      optional: true,
    },
    timeBasedSearch: {
      type: "string",
      label: "Time Based Search",
      description: "Filter the results by time",
      options: [
        {
          label: "Past hour",
          value: "qdr:h",
        },
        {
          label: "Past 24 hours",
          value: "qdr:d",
        },
        {
          label: "Past week",
          value: "qdr:w",
        },
        {
          label: "Past month",
          value: "qdr:m",
        },
        {
          label: "Past year",
          value: "qdr:y",
        },
      ],
      optional: true,
    },
    customTimeout: {
      type: "integer",
      label: "Custom Timeout",
      description: "Set a custom timeout for search operations. E.g. `30000`",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 10,
      optional: true,
    },
  },
  async run({ $ }) {
    const results = await this.firecrawl.search({
      $,
      data: {
        query: this.query,
        limit: this.maxResults,
        scrapeOptions: this.scrapeOptionFormats
          ? {
            formats: this.scrapeOptionFormats,
          }
          : undefined,
        tbs: this.timeBasedSearch,
        timeout: this.customTimeout,
      },
    });
    $.export("$summary", `Successfully searched for ${this.query}`);
    return results;
  },
};
