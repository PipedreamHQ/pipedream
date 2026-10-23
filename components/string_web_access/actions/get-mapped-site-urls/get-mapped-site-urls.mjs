import app from "../../string_web_access.app.mjs";
import { TERMINAL_STATUSES } from "../../common/constants.mjs";

export default {
  key: "string_web_access-get-mapped-site-urls",
  name: "Get Mapped Site URLs",
  description: "Get the status of a crawl started by **Map Site URLs** and, once it has finished, every URL it discovered. Use it when **Map Site URLs** returned a `jobId` before its crawl finished. While the crawl is still running, the job's status and progress are returned instead. If the crawl's approval was interrupted, it approves the job again so the crawl resumes within the budget set in **Map Site URLs**. [See the documentation](https://portal.usestring.ai/docs/api-reference/sitemap)",
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
    jobId: {
      propDefinition: [
        app,
        "jobId",
      ],
    },
  },
  async run({ $ }) {
    let state = await this.app.getSitemapStatus({
      $,
      jobId: this.jobId,
    });
    if (state.status === "partial_state") {
      state = await this.app.approveSitemap({
        $,
        jobId: this.jobId,
      });
    }
    const { status } = state;

    if (status === "failed") {
      throw new Error(`Crawl ${this.jobId} failed: ${state.errorMessage}`);
    }

    if (!TERMINAL_STATUSES.includes(status)) {
      $.export("$summary", `Crawl ${this.jobId} is ${status}; run this action again later to collect its URLs`);
      return state;
    }

    const results = await this.app.getAllSitemapUrls({
      $,
      jobId: this.jobId,
    });

    $.export("$summary", `Retrieved ${results.total} URL${results.total === 1
      ? ""
      : "s"} from crawl ${this.jobId}`);
    return {
      status,
      ...results,
    };
  },
};
