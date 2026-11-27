import app from "../../veilstrat.app.mjs";

export default {
  key: "veilstrat-check-api-connection",
  name: "Check API Connection",
  description: "Check API connectivity with an unmetered health request. Use **Get Account Usage** to check API eligibility and budgets. [See the documentation](https://app.veilstrat.com/docs/api/endpoints)",
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
    const result = await this.app.getHealth({
      $,
    });
    $.export("$summary", "Retrieved API health");
    return result;
  },
};
