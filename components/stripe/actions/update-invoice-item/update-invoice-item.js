const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-update-invoice-item",
  name: "Update Invoice Line Item",
  type: "action",
  version: "0.0.2",
  description: "Update an invoice line item. [See the " +
    "docs](https://stripe.com/docs/api/invoiceitems/update) for more information",
  props: {
    stripe,
    // Used to filter subscription and invoice options
    customer: {
      propDefinition: [
        stripe,
        "customer",
      ],
    },
    // Used to filter invoice options
    subscription: {
      propDefinition: [
        stripe,
        "subscription",
        ({ customer }) => ({
          customer,
        }),
      ],
    },
    // Used to populate invoice item options
    invoice: {
      propDefinition: [
        stripe,
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
        stripe,
        "invoice_item",
        ({ invoice }) => ({
          invoice,
        }),
      ],
      optional: false,
    },
    amount: {
      propDefinition: [
        stripe,
        "amount",
      ],
    },
    currency: {
      propDefinition: [
        stripe,
        "currency",
      ],
    },
    quantity: {
      propDefinition: [
        stripe,
        "quantity",
      ],
    },
    description: {
      propDefinition: [
        stripe,
        "description",
      ],
    },
    metadata: {
      propDefinition: [
        stripe,
        "metadata",
      ],
    },
    advanced: {
      propDefinition: [
        stripe,
        "advanced",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.stripe.sdk().invoiceItems.update(this.id, {
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
