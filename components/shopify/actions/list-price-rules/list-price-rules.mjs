import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-list-price-rules",
  name: "List Price Rules",
  description: "Lists price rules in the Shopify store. [See the documentation](https://shopify.dev/docs/api/admin-rest/2025-01/resources/pricerule#get-price-rules).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    shopify,
    limit: {
      propDefinition: [
        shopify,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.shopify.listPriceRules({
      limit: this.limit,
    });
    $.export("$summary", `Successfully retrieved ${response.length} price rule${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
