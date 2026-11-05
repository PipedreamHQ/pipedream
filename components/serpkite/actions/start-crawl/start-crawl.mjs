import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-start-crawl",
  name: "Start Crawl",
  description: "Start an asynchronous crawl of one website: pages read as Markdown, following links up to Max Depth hops and the site's sitemaps, honouring robots.txt. Returns a task `id` for **Get Crawl**. Credits for Limit pages are reserved and the unread rest refunded ([see pricing](https://serpkite.com/pricing)). [See the documentation](https://serpkite.com/docs/endpoints/crawl)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    url: {
      type: "string",
      label: "Start URL",
      description: "The page to start from, e.g. `https://example.com/docs/`.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum pages to read, from 1 to 1,000, e.g. `100`. Defaults to `25`. Credits for this many pages are reserved up front.",
      optional: true,
      min: 1,
      max: 1000,
    },
    maxDepth: {
      type: "integer",
      label: "Max Depth",
      description: "Link hops from the start URL, from 0 (only the start page) to 10, e.g. `3`. Defaults to `2`.",
      optional: true,
      min: 0,
      max: 10,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Read the pages most relevant to these words first, e.g. `authentication`.",
      optional: true,
    },
    includePaths: {
      type: "string[]",
      label: "Include Paths",
      description: "Regular expressions matched against the URL path; follow only paths matching one, e.g. `[\"^/docs/\", \"^/api/\"]`.",
      optional: true,
    },
    excludePaths: {
      type: "string[]",
      label: "Exclude Paths",
      description: "Regular expressions matched against the URL path; never follow paths matching one, e.g. `[\"^/blog/\"]`.",
      optional: true,
    },
    webhookUrl: {
      propDefinition: [
        app,
        "webhookUrl",
      ],
      description: "A public HTTPS URL that receives a signed `crawl.completed` event when the crawl ends, e.g. `https://example.com/hooks/serpkite`. Defaults to the account webhook set in the SerpKite dashboard.",
    },
  },
  async run({ $ }) {
    const response = await this.app.startCrawl({
      $,
      data: {
        url: this.url,
        limit: this.limit,
        max_depth: this.maxDepth,
        query: this.query,
        include_paths: this.includePaths,
        exclude_paths: this.excludePaths,
        webhook_url: this.webhookUrl,
      },
    });
    $.export("$summary", `Started crawl ${response.id}`);
    return response;
  },
};
