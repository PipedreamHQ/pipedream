import pick from "lodash.pick";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-update-invoice-item",
  name: "Update Invoice Line Item",
  type: "action",
  version: "0.1.0",
  description: "Update an invoice line item. [See the " +
    "docs](https://stripe.com/docs/api/invoiceitems/update) for more information",
  props: {
    app,
    // Used to filter subscription and invoice options
    customer: {
      propDefinition: [
        app,
        "customer",
      ],
    },
    // Used to filter invoice options
    subscription: {
      propDefinition: [
        app,
        "subscription",
        ({ customer }) => ({
          customer,
        }),
      ],
    },
    // Used to populate invoice item options
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
    id: {
      propDefinition: [
        app,
        "invoice_item",
        ({ invoice }) => ({
          invoice,
        }),
      ],
      optional: false,
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
      description: "Add any additional parameters that you require here.",
    },
  },
  async run({ $ }) {
    const resp = await this.app.sdk().invoiceItems.update(this.id, {
      ...pick(this, [
        "amount",
        "currency",
        "quantity",
        "description",
        "metadata",
      ]),
      ...this.advanced,
    });
    $.export("$summary", `Successfully updated the invoice item, "${resp.description || resp.id}"`);
    return resp;
  },
};
