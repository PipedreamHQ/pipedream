import amazonSellingPartner from "../../amazon_selling_partner.app.mjs";

export default {
  key: "amazon_selling_partner-get-order-details",
  name: "Get Order Details",
  description: "Fetches detailed information about a specific order using its order ID. [See the documentation](https://developer-docs.amazon.com/sp-api/reference/getorder)",
  version: "0.0.2",
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
    amazonOrderId: {
      propDefinition: [
        amazonSellingPartner,
        "orderId",
        (c) => ({
          marketplaceId: c.marketplaceId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.amazonSellingPartner.getOrder({
      $,
      orderId: this.amazonOrderId,
    });
    $.export("$summary", `Fetched order details for ${this.amazonOrderId}`);
    return response;
  },
};
