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
      description: "The page to start from.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum pages to read (1-1,000, default 25).",
      optional: true,
      min: 1,
      max: 1000,
    },
    maxDepth: {
      type: "integer",
      label: "Max Depth",
      description: "Link hops from the start URL (0-10, default 2).",
      optional: true,
      min: 0,
      max: 10,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Read the pages most relevant to these words first.",
      optional: true,
    },
    includePaths: {
      type: "string[]",
      label: "Include Paths",
      description: "Regular expressions; follow only URL paths matching one, such as `^/docs/`.",
      optional: true,
    },
    excludePaths: {
      type: "string[]",
      label: "Exclude Paths",
      description: "Regular expressions; never follow URL paths matching one.",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "Receives a signed `crawl.completed` event when the crawl ends.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.post({
      $,
      path: "/crawl",
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
