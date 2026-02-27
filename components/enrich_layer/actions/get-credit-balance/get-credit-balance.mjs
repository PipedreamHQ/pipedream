import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-get-credit-balance",
  name: "Get Credit Balance",
  description: "View your Enrich Layer API credit balance. Cost: 0 credits. [See the documentation](https://enrichlayer.com/docs/api/v2/meta-api/view-credit-balance).",
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
    const response = await this.enrichlayer.getCreditBalance({
      $,
    });
    $.export("$summary", `Credit balance: ${response.credit_balance}`);
    return response;
  },
};
