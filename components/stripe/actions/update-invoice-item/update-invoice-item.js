const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-update-invoice-item",
  name: "Update Invoice Line Item",
  type: "action",
  version: "0.0.2",
  description: "Update an invoice line item",
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
        (configuredProps) => ({
          customer: configuredProps.customer,
        }),
      ],
    },
    // Used to populate invoice item options
    invoice: {
      propDefinition: [
        stripe,
        "invoice",
        (configuredProps) => ({
          customer: configuredProps.customer,
          subscription: configuredProps.subscription,
        }),
      ],
    },
    id: {
      propDefinition: [
        stripe,
        "invoice_item",
        (configuredProps) => ({
          invoice: configuredProps.invoice,
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
  async run() {
    return await this.stripe.sdk().invoiceItems.update(this.id, {
      ...pick(this, [
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
