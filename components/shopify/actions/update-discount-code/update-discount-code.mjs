import { ConfigurationError } from "@pipedream/platform";
import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-update-discount-code",
  name: "Update Discount Code",
  description: "Updates the value of an existing discount code belonging to a price rule in Shopify. Run **List Price Rules** and **List Discount Codes** to find valid IDs. [See the documentation](https://shopify.dev/docs/api/admin-rest/2025-01/resources/discountcode#put-price-rules-price-rule-id-discount-codes-discount-code-id).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
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
    code: {
      type: "string",
      label: "Code",
      description: "The new discount code string (max 255 chars, case-insensitive), e.g. `SUMMER25`.",
    },
  },
  async run({ $ }) {
    if (!this.code || this.code.length > 255) {
      throw new ConfigurationError("Provide a code between 1 and 255 characters.");
    }
    const response = await this.shopify.updateDiscountCode(this.priceRuleId, this.discountCodeId, {
      code: this.code,
    });
    $.export("$summary", `Successfully updated discount code ${response.id} to "${response.code}"`);
    return response;
  },
};
