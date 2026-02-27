import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-get-credit-balance",
  name: "Get Credit Balance",
  description: "View your Enrich Layer API credit balance. Cost: 0 credits. [See the docs](https://enrichlayer.com/docs).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
  },
  async run({ $ }) {
    const response = await this.enrichlayer._makeRequest({
      $,
      path: "/api/v2/credit-balance",
    });
    $.export("$summary", `Credit balance: ${response.credit_balance}`);
    return response;
  },
};
