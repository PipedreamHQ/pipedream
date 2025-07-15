import amazonSellingPartner from "../../amazon_selling_partner.app.mjs";

export default {
  key: "amazon_selling_partner-fetch-orders-by-date-range",
  name: "Fetch Orders by Date Range",
  description: "Retrieves a list of orders based on a specified date range, buyer email, or order ID. [See the documentation](https://developer-docs.amazon.com/sp-api/reference/getorders)",
  version: "0.0.1",
  type: "action",
  props: {
    amazonSellingPartner,
    marketplaceId: {
      propDefinition: [
        amazonSellingPartner,
        "marketplaceId",
      ],
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Fetch orders created after this ISO date.",
    },
    createdBefore: {
      type: "string",
      label: "Created Before",
      description: "Fetch orders created before this ISO date.",
      optional: true,
    },
    buyerEmail: {
      type: "string",
      label: "Buyer Email",
      description: "The email address of a buyer",
      optional: true,
    },
    amazonOrderId: {
      propDefinition: [
        amazonSellingPartner,
        "orderId",
        (c) => ({
          marketplaceId: c.marketplaceId,
        }),
      ],
      label: "Seller Order ID",
      description: "An order identifier that is specified by the seller. Used to select only the orders that match the order identifier. If SellerOrderId is specified, then FulfillmentChannels, OrderStatuses, PaymentMethod, LastUpdatedAfter, LastUpdatedBefore, and BuyerEmail cannot be specified.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { payload } = await this.amazonSellingPartner.listOrders({
      $,
      params: {
        MarketplaceIds: this.marketplaceId,
        CreatedAfter: this.createdAfter,
        CreatedBefore: this.createdBefore,
        BuyerEmail: this.buyerEmail,
        SellerOrderId: this.amazonOrderId,
      },
    });
    $.export("$summary", `Fetched ${payload.Orders.length} order${payload.Orders.length === 1
      ? ""
      : "s"}`);
    return payload.Orders || [];
  },
};
