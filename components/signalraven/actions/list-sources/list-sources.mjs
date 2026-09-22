import app from "../../signalraven.app.mjs";

export default {
  key: "signalraven-list-sources",
  name: "List Sources",
  description: "List the LinkedIn sources being monitored, with signal counts and a strength score for each. [See the documentation](https://signalraven.ai/developers/api)",
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
    period: {
      type: "string",
      label: "Period",
      description: "Metrics window, for example `7d`, `30d` or `90d`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listSources({
      $,
      params: {
        period: this.period,
      },
    });
    const count = response.data?.length || 0;
    $.export("$summary", `Fetched ${count} source${count === 1
      ? ""
      : "s"}.`);
    return response;
  },
};
