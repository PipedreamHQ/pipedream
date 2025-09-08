import app from "../../token_metrics.app.mjs";

export default {
  key: "token_metrics-get-tokens",
  name: "Get Tokens",
  description: "Gets the list of coins and their associated token_id supported by Token Metrics. [See the documentation](https://developers.tokenmetrics.com/reference/tokens)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getTokens({
      $,
      params: {
        limit: this.limit,
      },
    });

    $.export("$summary", "Retrieved the list of tokens successfully");

    return response;
  },
};
