const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-create-invoice-item",
  name: "Create Invoice Line Item",
  type: "action",
  version: "0.0.1",
  description: "Add a line item to an invoice",
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
      ],
    },
    invoice: {
      propDefinition: [
        stripe,
        "invoice",
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
  async run() {
    return await this.stripe.sdk().invoiceItems.create({
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
  },
};
