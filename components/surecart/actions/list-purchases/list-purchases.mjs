import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-purchases",
  name: "List Purchases",
  description: "Return a list of purchases. [See the documentation](https://developer.surecart.com/api-reference/purchases/list)",
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
    createdAtGt: {
      type: "integer",
      label: "Created After (Unix timestamp)",
      description: "Return purchases created after this Unix timestamp. Example: `1700000000`",
      optional: true,
    },
    createdAtGte: {
      type: "integer",
      label: "Created At or After (Unix timestamp)",
      description: "Return purchases created at or after this Unix timestamp. Example: `1700000000`",
      optional: true,
    },
    createdAtLt: {
      type: "integer",
      label: "Created Before (Unix timestamp)",
      description: "Return purchases created before this Unix timestamp. Example: `1710000000`",
      optional: true,
    },
    createdAtLte: {
      type: "integer",
      label: "Created At or Before (Unix timestamp)",
      description: "Return purchases created at or before this Unix timestamp. Example: `1710000000`",
      optional: true,
    },
    customerIds: {
      propDefinition: [
        surecart,
        "customerIds",
      ],
    },
    downloadable: {
      type: "boolean",
      label: "Downloadable",
      description: "Filter for purchases that have associated downloads.",
      optional: true,
    },
    ids: {
      propDefinition: [
        surecart,
        "ids",
      ],
    },
    licenseIds: {
      type: "string[]",
      label: "License IDs",
      description: "Filter by license IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
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
    orderIds: {
      type: "string[]",
      label: "Order IDs",
      description: "Filter by order IDs. Use **List Orders** to find order IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
    },
    productIds: {
      propDefinition: [
        surecart,
        "productIds",
      ],
    },
    revoked: {
      type: "boolean",
      label: "Revoked",
      description: "Filter by revocation status. Set to `true` to return only revoked purchases.",
      optional: true,
    },
    subscriptionIds: {
      type: "string[]",
      label: "Subscription IDs",
      description: "Filter by subscription IDs. Use **List Subscriptions** to find subscription IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listPurchases,
      args: {
        $,
        params: {
          "checkout_ids[]": this.checkoutIds,
          "created_at[gt]": this.createdAtGt,
          "created_at[gte]": this.createdAtGte,
          "created_at[lt]": this.createdAtLt,
          "created_at[lte]": this.createdAtLte,
          "customer_ids[]": this.customerIds,
          "downloadable": this.downloadable,
          "ids[]": this.ids,
          "license_ids[]": this.licenseIds,
          "live_mode": this.liveMode,
          "order_ids[]": this.orderIds,
          "product_ids[]": this.productIds,
          "revoked": this.revoked,
          "subscription_ids[]": this.subscriptionIds,
        },
      },
      max: this.maxResults,
    });

    const purchases = [];
    for await (const purchase of results) {
      purchases.push(purchase);
    }

    $.export("$summary", `Successfully retrieved ${purchases.length} purchase(s)`);
    return purchases;
  },
};
