import { ConfigurationError } from "@pipedream/platform";
import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-create-discount-codes-batch",
  name: "Create Discount Codes in Bulk",
  description: "Adds multiple discount codes to a price rule in Shopify (up to 100 codes per request). [See the documentation](https://shopify.dev/docs/api/admin-rest/2025-01/resources/discountcode#post-price-rules-price-rule-id-batch).",
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
    codes: {
      type: "string[]",
      label: "Codes",
      description: "An array of discount code strings to create (max 100), e.g. `[\"BULK001\", \"BULK002\", \"BULK003\"]`.",
    },
  },
  async run({ $ }) {
    if (this.codes.length < 1 || this.codes.length > 100) {
      throw new ConfigurationError("Provide between 1 and 100 discount codes.");
    }
    const response = await this.shopify.createDiscountCodesBatch(this.priceRuleId, this.codes);
    $.export("$summary", `Successfully created batch job for ${this.codes.length} discount code${this.codes.length === 1
      ? ""
      : "s"} (status: ${response.status})`);
    return response;
  },
};
