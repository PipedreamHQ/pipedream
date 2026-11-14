import app from "../../veilstrat.app.mjs";

export default {
  key: "veilstrat-get-account-usage",
  name: "Get Account Usage",
  description: "Check API budgets and reset times before running research. This endpoint is exempt from the VeilStrat request budget. [See the documentation](https://app.veilstrat.com/docs/api/endpoints)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const result = await this.app.getUsage({
      $,
    });
    $.export("$summary", "Retrieved account API budgets");
    return result;
  },
};
