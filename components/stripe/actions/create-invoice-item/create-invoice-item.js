const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-create-invoice-item",
  name: "Create Invoice Line Item",
  type: "action",
  version: "0.0.2",
  description: "Add a line item to an invoice. [See the " +
    "docs](https://stripe.com/docs/api/invoiceitems/create) for more information",
  props: {
    stripe,
    customer: {
      propDefinition: [
        stripe,
        "customer",
      ],
      optional: false,
    },
    price: {
      propDefinition: [
        stripe,
        "price",
      ],
    },
    subscription: {
      propDefinition: [
        stripe,
        "subscription",
        ({ customer }) => ({
          customer,
        }),
      ],
    },
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
    const resp = await this.stripe.sdk().invoiceItems.create({
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
