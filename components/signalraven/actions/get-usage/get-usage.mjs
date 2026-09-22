import app from "../../signalraven.app.mjs";

export default {
  key: "signalraven-get-usage",
  name: "Get Usage",
  description: "Fetch the workspace plan, credit balance and current-period usage. [See the documentation](https://signalraven.ai/developers/api)",
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
  },
  async run({ $ }) {
    const response = await this.app.getUsage({
      $,
    });
    $.export("$summary", "Fetched usage and credit balance.");
    return response;
  },
};
