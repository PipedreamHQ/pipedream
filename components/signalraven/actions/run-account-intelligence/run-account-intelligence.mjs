import app from "../../signalraven.app.mjs";

export default {
  key: "signalraven-run-account-intelligence",
  name: "Run Account Intelligence",
  description: "Start an account research report for a company LinkedIn URL. Spends credits; the report completes asynchronously. [See the documentation](https://signalraven.ai/developers/api)",
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
    companyUrl: {
      type: "string",
      label: "Company LinkedIn URL",
      description: "The company page to research, for example `https://www.linkedin.com/company/example`.",
    },
  },
  async run({ $ }) {
    const response = await this.app.runAccountIntelligence({
      $,
      data: {
        companyUrl: this.companyUrl,
      },
    });
    $.export("$summary", `Started account intelligence for ${this.companyUrl}.`);
    return response;
  },
};
