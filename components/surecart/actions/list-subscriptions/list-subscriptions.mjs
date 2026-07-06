import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-subscriptions",
  name: "List Subscriptions",
  description: "Return a list of subscriptions. [See the documentation](https://developer.surecart.com/api-reference/subscriptions/list)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    checkoutIds: {
      propDefinition: [
        surecart,
        "checkoutIds",
      ],
    },
    customerIds: {
      propDefinition: [
        surecart,
        "customerIds",
      ],
    },
    finite: {
      type: "boolean",
      label: "Finite",
      description: "Set to `true` to return only finite (fixed-length) subscriptions, or `false` for indefinite subscriptions.",
      optional: true,
    },
    ids: {
      propDefinition: [
        surecart,
        "ids",
      ],
    },
    maxResults: {
      propDefinition: [
        surecart,
        "maxResults",
      ],
    },
    liveMode: {
      propDefinition: [
        surecart,
        "liveMode",
      ],
    },
    priceIds: {
      type: "string[]",
      label: "Price IDs",
      description: "Filter by price IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
    },
    productIds: {
      propDefinition: [
        surecart,
        "productIds",
      ],
    },
    purchaseIds: {
      type: "string[]",
      label: "Purchase IDs",
      description: "Filter by purchase IDs. Use **List Purchases** to find purchase IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Full-text search query to filter subscriptions. Example: `Jane`",
      optional: true,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter subscriptions by status. Example: `[\"active\",\"canceled\"]`",
      optional: true,
      options: [
        "incomplete",
        "trialing",
        "active",
        "past_due",
        "canceled",
        "completed",
      ],
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listSubscriptions,
      args: {
        $,
        params: {
          "checkout_ids[]": this.checkoutIds,
          "customer_ids[]": this.customerIds,
          "finite": this.finite,
          "ids[]": this.ids,
          "live_mode": this.liveMode,
          "price_ids[]": this.priceIds,
          "product_ids[]": this.productIds,
          "purchase_ids[]": this.purchaseIds,
          "query": this.query,
          "status[]": this.status,
        },
      },
      max: this.maxResults,
    });

    const subscriptions = [];
    for await (const subscription of results) {
      subscriptions.push(subscription);
    }

    $.export("$summary", `Successfully retrieved ${subscriptions.length} subscription(s)`);
    return subscriptions;
  },
};
