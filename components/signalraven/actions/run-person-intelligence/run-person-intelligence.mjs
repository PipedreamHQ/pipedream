import app from "../../signalraven.app.mjs";

export default {
  key: "signalraven-run-person-intelligence",
  name: "Run Person Intelligence",
  description: "Start a person research report for a LinkedIn profile URL. Spends credits unless a recent report exists, in which case the cached report is returned (`cached: true`). A new report completes asynchronously. [See the documentation](https://signalraven.ai/developers/api)",
  type: "action",
  ai: "optimized",
  version: "0.0.1",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    personUrl: {
      type: "string",
      label: "Person LinkedIn URL",
      description: "The profile to research, for example `https://www.linkedin.com/in/example`.",
    },
    sourceCompanyReportId: {
      type: "string",
      label: "Source Account Report ID",
      description: "Optional account report to attach this person to: the `id` of an account report from **List Intelligence Reports**, for example `8a1d...`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.runPersonIntelligence({
      $,
      data: {
        personUrl: this.personUrl,
        sourceCompanyReportId: this.sourceCompanyReportId,
      },
    });
    $.export("$summary", `Started person intelligence for ${this.personUrl}.`);
    return response;
  },
};
