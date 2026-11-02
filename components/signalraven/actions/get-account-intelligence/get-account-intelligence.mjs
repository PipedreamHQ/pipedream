import app from "../../signalraven.app.mjs";

export default {
  key: "signalraven-get-account-intelligence",
  name: "Get Account Intelligence",
  description: "Fetch an account research report: firmographics, the buying committee, disposition and openers. [See the documentation](https://signalraven.ai/developers/api)",
  type: "action",
  ai: "optimized",
  version: "0.0.1",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    reportId: {
      propDefinition: [
        app,
        "reportId",
        () => ({
          reportType: "account",
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getAccountIntelligence({
      $,
      reportId: this.reportId,
    });
    $.export("$summary", `Fetched account report ${this.reportId}.`);
    return response;
  },
};
