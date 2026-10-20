import app from "../../string_web_access.app.mjs";
import { TERMINAL_STATUSES } from "../../common/constants.mjs";
import { sleep } from "../../common/utils.mjs";

const POLLING_INTERVAL = 5000;

export default {
  key: "string_web_access-map-site-urls",
  name: "Map Site URLs",
  description: "Crawl a site within a spend cap and return the URLs it discovered. If the crawl is still running when `maxWaitSeconds` elapses, pass the returned `jobId` to **Get Mapped Site URLs** to collect the URLs later. [See the documentation](https://portal.usestring.ai/docs/api-reference/sitemap)",
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
    budgetUsd: {
      type: "string",
      label: "Budget (USD)",
      description: "Hard spend cap for this crawl, e.g. `1.00`. The job stops rather than exceeding it, so a workflow can never approve an open-ended bill.",
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
    maxWaitSeconds: {
      type: "integer",
      label: "Max Wait (seconds)",
      description: "How long to wait for the crawl, e.g. `300`. If it is still running, the job ID is returned so **Get Mapped Site URLs** can collect the URLs later.",
      optional: true,
      default: 300,
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
    let state = {
      status: "running",
    };

    while (Date.now() < deadline) {
      await sleep(POLLING_INTERVAL);
      state = await this.app.getSitemapStatus({
        $,
        jobId: quote.jobId,
      });

      if (state.status === "partial_state") {
        await this.app.approveSitemap({
          $,
          jobId: quote.jobId,
        });
        continue;
      }
      if (TERMINAL_STATUSES.includes(state.status)) {
        break;
      }
    }

    const { status } = state;

    if (status === "failed") {
      throw new Error(`Crawl ${quote.jobId} failed: ${state.errorMessage}`);
    }

    if (!TERMINAL_STATUSES.includes(status)) {
      $.export("$summary", `Crawl ${quote.jobId} is still running; collect its URLs with Get Mapped Site URLs`);
      return {
        ...quote,
        status,
        urls: [],
      };
    }

    const results = await this.app.getAllSitemapUrls({
      $,
      jobId: quote.jobId,
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
