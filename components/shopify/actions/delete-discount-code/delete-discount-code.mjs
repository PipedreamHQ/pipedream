import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-delete-discount-code",
  name: "Delete Discount Code",
  description: "Permanently deletes a discount code from a price rule in Shopify. [See the documentation](https://shopify.dev/docs/api/admin-rest/2025-01/resources/discountcode#delete-price-rules-price-rule-id-discount-codes-discount-code-id).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
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
    const response = await this.shopify.deleteDiscountCode(this.priceRuleId, this.discountCodeId);
    $.export("$summary", `Successfully deleted discount code ${this.discountCodeId} from price rule ${this.priceRuleId}`);
    return response;
  },
};
