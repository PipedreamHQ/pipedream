import app from "../../string_web_access.app.mjs";
import { TERMINAL_STATUSES } from "../../common/constants.mjs";

export default {
  key: "string_web_access-get-mapped-site-urls",
  name: "Get Mapped Site URLs",
  description: "Get the status of a crawl started by **Start Site Crawl** and, once it has finished, every URL it discovered. While the crawl is still running, the job's status and progress are returned instead. [See the documentation](https://portal.usestring.ai/docs/api-reference/sitemap)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const state = await this.app.getSitemapStatus({
      $,
      jobId: this.jobId,
    });
    const { status } = state;

    if (status === "failed") {
      throw new Error(`Crawl ${this.jobId} failed: ${state.errorMessage}`);
    }

    if (status === "partial_state") {
      $.export("$summary", `Crawl ${this.jobId} did not finish starting; run Start Site Crawl again`);
      return state;
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
