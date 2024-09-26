import pick from "lodash.pick";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-create-invoice-item",
  name: "Create Invoice Line Item",
  type: "action",
  version: "0.1.0",
  description: "Add a line item to an invoice. [See the " +
    "docs](https://stripe.com/docs/api/invoiceitems/create) for more information",
  props: {
    app,
    customer: {
      propDefinition: [
        app,
        "customer",
      ],
      optional: false,
    },
    price: {
      propDefinition: [
        app,
        "price",
      ],
    },
    subscription: {
      propDefinition: [
        app,
        "subscription",
        ({ customer }) => ({
          customer,
        }),
      ],
    },
    invoice: {
      propDefinition: [
        app,
        "invoice",
        ({
          customer, subscription,
        }) => ({
          customer,
          subscription,
        }),
      ],
    },
    amount: {
      propDefinition: [
        app,
        "amount",
      ],
    },
    currency: {
      propDefinition: [
        app,
        "currency",
      ],
    },
    quantity: {
      propDefinition: [
        app,
        "quantity",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
    advanced: {
      propDefinition: [
        app,
        "metadata",
      ],
      label: "Advanced Options",
      description: "Add any additional parameters that you require here",
    },
  },
  async run({ $ }) {
    const resp = await this.app.sdk().invoiceItems.create({
      ...pick(this, [
        "customer",
        "price",
        "subscription",
        "invoice",
        "amount",
        "currency",
        "quantity",
        "description",
        "metadata",
      ]),
      ...this.advanced,
    });

    $.export("$summary", "Successfully added new invoice item");

    return resp;
  },
};
