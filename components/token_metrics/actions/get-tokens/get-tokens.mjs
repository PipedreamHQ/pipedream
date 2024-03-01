import tokenMetrics from "../../token_metrics.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "token_metrics-get-tokens",
  name: "Get Tokens",
  description: "Get the list of coins and their associated token_id supported by Token Metrics. [See the documentation](https://developers.tokenmetrics.com/reference/tokens)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    tokenMetrics,
  },
  async run({ $ }) {
    const response = await this.tokenMetrics.getTokens();
    $.export("$summary", "Retrieved the list of tokens successfully");
    return response;
  },
};
