import pick from "lodash.pick";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-list-invoices",
  name: "List Invoices",
  type: "action",
  version: "0.1.0",
  description: "Find or list invoices. [See the docs](https://stripe.com/docs/api/invoices/list) " +
    "for more information",
  props: {
    app,
    customer: {
      propDefinition: [
        app,
        "customer",
      ],
    },
    subscription: {
      propDefinition: [
        app,
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
        app,
        "invoice_status",
      ],
    },
    collection_method: {
      propDefinition: [
        app,
        "invoice_collection_method",
      ],
    },
    limit: {
      propDefinition: [
        app,
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
    const resp = await this.app.sdk().invoices.list(params)
      .autoPagingToArray({
        limit: this.limit,
      });
    $.export("$summary", "Successfully fetched invoices");
    return resp;
  },
};
