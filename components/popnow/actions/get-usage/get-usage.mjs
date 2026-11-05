import app from "../../popnow.app.mjs";

export default {
  key: "popnow-get-usage",
  name: "Get Usage",
  description: "Get calls and settled USD spend for your API key, per day and per model. The range is at most 92 days. [See the documentation](https://popnow.ai/docs/billing)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    from: {
      propDefinition: [
        app,
        "from",
      ],
    },
    to: {
      propDefinition: [
        app,
        "to",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getUsage({
      $,
      params: {
        from: this.from,
        to: this.to,
      },
    });
    $.export("$summary", `Successfully retrieved usage: ${response?.totalCalls ?? 0} call(s), $${response?.totalSpend ?? "0"} spent from ${response?.from} to ${response?.to}`);
    return response;
  },
};
