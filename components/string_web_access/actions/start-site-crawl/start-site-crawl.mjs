import app from "../../string_web_access.app.mjs";

export default {
  key: "string_web_access-start-site-crawl",
  name: "Start Site Crawl",
  description: "Start a crawl that **Quote Site Crawl** quoted. This is the billing-consent step: the quoted cost is held against your balance and settled when the crawl finishes, and the crawl stops before it exceeds its budget. Collect the URLs with **Get Mapped Site URLs**. [See the documentation](https://portal.usestring.ai/docs/api-reference/sitemap)",
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
    let state = await this.app.approveSitemap({
      $,
      jobId: this.jobId,
    });
    if (state.status === "partial_state") {
      state = await this.app.approveSitemap({
        $,
        jobId: this.jobId,
      });
    }

    if (state.status === "partial_state") {
      throw new Error(`Crawl ${this.jobId} did not start; run this action again`);
    }
    if (state.status === "failed") {
      throw new Error(`Crawl ${this.jobId} failed${state.errorMessage
        ? `: ${state.errorMessage}`
        : ""}`);
    }

    $.export("$summary", `Crawl ${this.jobId} is ${state.status}; collect its URLs with Get Mapped Site URLs`);
    return state;
  },
};
