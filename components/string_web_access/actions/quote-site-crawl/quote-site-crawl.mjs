import app from "../../string_web_access.app.mjs";

export default {
  key: "string_web_access-quote-site-crawl",
  name: "Quote Site Crawl",
  description: "Quote a crawl of one site and get a job ID back with its estimated pages and cost. Nothing is crawled or billed until **Start Site Crawl** starts the job, and a quote that is not started within an hour expires. [See the documentation](https://portal.usestring.ai/docs/api-reference/sitemap)",
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
      propDefinition: [
        app,
        "url",
      ],
      label: "Start URL",
      description: "Where the crawl starts, e.g. `https://example.com/docs`. It stays on this hostname.",
    },
    maxPages: {
      type: "integer",
      label: "Max Pages",
      description: "Maximum pages to crawl, 1-10000, e.g. `500`",
      optional: true,
      default: 100,
    },
    maxDepth: {
      type: "integer",
      label: "Max Depth",
      description: "Maximum link depth from the start URL, 1-100, e.g. `3`",
      optional: true,
      default: 2,
    },
    pathPrefix: {
      type: "string",
      label: "Path Prefix",
      description: "Only crawl URLs whose path starts with this, e.g. `/docs`",
      optional: true,
    },
    useSitemap: {
      type: "boolean",
      label: "Seed From sitemap.xml",
      description: "Also seed from the site's root `sitemap.xml`, e.g. `true`. Costs one extra page and finds pages that internal links miss.",
      optional: true,
    },
    budgetUsd: {
      type: "string",
      label: "Budget (USD)",
      description: "Spend cap for this crawl, e.g. `1.00`. Defaults to the quote, so a started crawl stops before it costs more than quoted.",
      optional: true,
    },
  },
  async run({ $ }) {
    const quote = await this.app.submitSitemap({
      $,
      data: {
        url: this.url,
        maxPages: this.maxPages,
        maxDepth: this.maxDepth,
        pathPrefix: this.pathPrefix,
        useSitemap: this.useSitemap,
        budgetUsd: this.budgetUsd
          ? Number(this.budgetUsd)
          : undefined,
      },
    });

    $.export("$summary", `Quoted a crawl of up to ${quote.estimatedPages} pages for $${Number(quote.estimatedCostUsd)}; start it with Start Site Crawl within an hour`);
    return quote;
  },
};
