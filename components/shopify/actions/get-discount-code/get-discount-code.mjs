import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-get-discount-code",
  name: "Get Discount Code",
  description: "Retrieves a single discount code that belongs to a price rule in Shopify. Run **List Price Rules** to find a valid price rule ID and **List Discount Codes** to find a valid discount code ID. [See the documentation](https://shopify.dev/docs/api/admin-rest/2025-01/resources/discountcode#get-price-rules-price-rule-id-discount-codes-discount-code-id).",
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
    discountCodeId: {
      propDefinition: [
        shopify,
        "discountCodeId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.shopify.getDiscountCode(this.priceRuleId, this.discountCodeId);
    $.export("$summary", `Successfully retrieved discount code ${response.id}`);
    return response;
  },
};
