const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-list-invoices",
  name: "List Invoices",
  type: "action",
  version: "0.0.2",
  description: "Find or list invoices. [See the docs](https://stripe.com/docs/api/invoices/list) " +
    "for more information",
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
        ({
          customer, price,
        }) => ({
          customer,
          price,
        }),
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
  async run({ $ }) {
    const params = pick(this, [
      "customer",
      "subscription",
      "status",
      "collection_method",
    ]);
    const resp = await this.stripe.sdk().invoices.list(params)
      .autoPagingToArray({
        limit: this.limit,
      });
    $.export("$summary", "Successfully fetched invoices");
    return resp;
  },
};
