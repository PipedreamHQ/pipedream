const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-list-invoices",
  name: "List Invoices",
  type: "action",
  version: "0.0.1",
  description: "Find or list invoices",
  props: {
    stripe,
    customer: {
      propDefinition: [
        stripe,
        "customer",
      ],
    },
    subscription: {
      propDefinition: [
        stripe,
        "subscription",
      ],
    },
    status: {
      propDefinition: [
        stripe,
        "invoice_status",
      ],
    },
    collection_method: {
      propDefinition: [
        stripe,
        "invoice_collection_method",
      ],
    },
    limit: {
      propDefinition: [
        stripe,
        "limit",
      ],
    },
  },
  async run() {
    const params = pick(this, [
      "customer",
      "subscription",
      "status",
      "collection_method",
    ]);
    return await this.stripe.sdk().invoices.list(params)
      .autoPagingToArray({
        limit: this.limit,
      });
  },
};
