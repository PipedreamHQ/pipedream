const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-invoice-item",
  name: "Retrieve Invoice Line Item",
  type: "action",
  version: "0.0.2",
  description: "Retrieve a single line item on an invoice",
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
  },
  async run() {
    return await this.stripe.sdk().invoiceItems.retrieve(this.id);
  },
};
