import amazonSellingPartner from "../../amazon_sp.app.mjs";

export default {
  key: "amazon_sp-optimize-pricing",
  name: "Optimize Product Pricing",
  description: "Retrieves pricing data to adjust product prices dynamically based on market trends. [See the documentation](https://developer-docs.amazon.com/sp-api/reference/getcompetitivepricing)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    amazonSellingPartner,
    marketplaceId: {
      propDefinition: [
        amazonSellingPartner,
        "marketplaceId",
      ],
    },
    itemType: {
      type: "string",
      label: "Item Type",
      description: "Indicates whether ASIN values or seller SKU values are used to identify items. If you specify Asin, the information in the response will be dependent on the list of Asins you provide in the Asins parameter. If you specify Sku, the information in the response will be dependent on the list of Skus you provide in the Skus parameter.",
      options: [
        "Asin",
        "Sku",
      ],
    },
    values: {
      type: "string[]",
      label: "Values",
      description: "A list of ASINs or seller SKUs. You may specify up to 20 identifiers.",
    },
    customerType: {
      type: "string",
      label: "Customer Type",
      description: "Filters the offer listings based on customer type",
      options: [
        "Consumer",
        "Business",
      ],
    },
  },
  async run({ $ }) {
    const { payload } = await this.amazonSellingPartner.listProductPricing({
      $,
      params: {
        MarketplaceId: this.marketplaceId,
        ItemType: this.itemType,
        [this.itemType === "Asin"
          ? "Asins"
          : "Skus"]: this.values.join(","),
        CustomerType: this.customerType,
      },
    });
    if (payload[0]?.Product) {
      $.export("$summary", "Fetched pricing information");
    }
    return payload;
  },
};
