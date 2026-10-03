import app from "../../string_web_access.app.mjs";

const POLLING_INTERVAL = 5000;
const TERMINAL_STATUSES = [
  "completed",
  "failed",
  "canceled",
  "token_cap_exceeded",
];

export default {
  key: "string_web_access-map-site-urls",
  name: "Map Site URLs",
  description: "Crawl a site within a spend cap and return the URLs it discovered. [See the documentation](https://portal.usestring.ai/docs/api-reference/sitemap)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
      label: "Start URL",
      description: "Where the crawl starts. It stays on this hostname.",
    },
    budgetUsd: {
      type: "string",
      label: "Budget (USD)",
      description: "Hard spend cap for this crawl, e.g. `1.00`. The job stops rather than exceeding it, so a workflow can never approve an open-ended bill.",
    },
    maxPages: {
      type: "integer",
      label: "Max Pages",
      description: "Maximum pages to crawl, 1-10000",
      optional: true,
      default: 100,
    },
    maxDepth: {
      type: "integer",
      label: "Max Depth",
      description: "Maximum link depth from the start URL, 1-100",
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
      description: "Also seed from the site's root `sitemap.xml`. Costs one extra page and finds pages that internal links miss.",
      optional: true,
    },
    maxWaitSeconds: {
      type: "integer",
      label: "Max Wait (seconds)",
      description: "How long to wait for the crawl. If it is still running, the job ID is returned so a later step can collect the URLs.",
      optional: true,
      default: 300,
    },
  },
  methods: {
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
  async run({ $ }) {
    const quote = await this.app.submitSitemap({
      $,
      data: {
        url: this.url,
        budgetUsd: Number(this.budgetUsd),
        maxPages: this.maxPages,
        maxDepth: this.maxDepth,
        pathPrefix: this.pathPrefix,
        useSitemap: this.useSitemap,
      },
    });

    await this.app.approveSitemap({
      $,
      jobId: quote.jobId,
    });

    const deadline = Date.now() + ((this.maxWaitSeconds ?? 300) * 1000);
    let status = "running";

    while (Date.now() < deadline) {
      await this.sleep(POLLING_INTERVAL);
      const state = await this.app.getSitemapStatus({
        $,
        jobId: quote.jobId,
      });
      status = state.status;

      if (status === "partial_state") {
        await this.app.approveSitemap({
          $,
          jobId: quote.jobId,
        });
        continue;
      }
      if (TERMINAL_STATUSES.includes(status)) {
        break;
      }
    }

    if (!TERMINAL_STATUSES.includes(status)) {
      $.export("$summary", `Crawl ${quote.jobId} is still running; collect its URLs with the job ID`);
      return {
        ...quote,
        status,
        urls: [],
      };
    }

    const results = await this.app.getSitemapUrls({
      $,
      jobId: quote.jobId,
      params: {
        limit: 1000,
        offset: 0,
      },
    });

    $.export("$summary", `Discovered ${results.total} URL${results.total === 1
      ? ""
      : "s"} on ${this.url}`);
    return {
      jobId: quote.jobId,
      status,
      estimatedCostUsd: quote.estimatedCostUsd,
      estimatedPages: quote.estimatedPages,
      ...results,
    };
  },
};
