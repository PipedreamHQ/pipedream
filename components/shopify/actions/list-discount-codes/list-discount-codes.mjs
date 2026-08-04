import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-list-discount-codes",
  name: "List Discount Codes",
  description: "Lists all discount codes for a given price rule in Shopify so you can obtain a valid discount code ID. [See the documentation](https://shopify.dev/docs/api/admin-rest/2025-01/resources/discountcode#get-price-rules-price-rule-id-discount-codes).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    shopify,
    priceRuleId: {
      propDefinition: [
        shopify,
        "priceRuleId",
      ],
    },
    limit: {
      propDefinition: [
        shopify,
        "limit",
      ],
      description: "Maximum number of discount codes to return. When omitted, all codes for the price rule are returned.",
    },
  },
  async run({ $ }) {
    const response = await this.shopify.listDiscountCodes(this.priceRuleId, {
      limit: this.limit,
    });
    $.export("$summary", `Successfully retrieved ${response.length} discount code${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
