const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-update-invoice",
  name: "Update Invoice",
  type: "action",
  version: "0.0.1",
  description: "Update an invoice",
  props: {
    stripe,
    id: {
      propDefinition: [
        stripe,
        "invoice",
      ],
      optional: false,
    },
    description: {
      propDefinition: [
        stripe,
        "description",
      ],
    },
    auto_advance: {
      propDefinition: [
        stripe,
        "invoice_auto_advance",
      ],
    },
    collection_method: {
      propDefinition: [
        stripe,
        "invoice_collection_method",
      ],
    },
    days_until_due: {
      propDefinition: [
        stripe,
        "invoice_days_until_due",
      ],
    },
    default_payment_method: {
      propDefinition: [
        stripe,
        "payment_method",
      ],
      label: "Default Payment Method",
      description: "Must belong to the customer associated with the invoice. If not set, " +
        "defaults to the subscription’s default payment method, if any, or to the default " +
        "payment method in the customer’s invoice settings.",
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
    return await this.stripe.sdk().invoices.update(this.id, {
      ...pick(this, [
        "description",
        "auto_advance",
        "collection_method",
        "days_until_due",
        "default_payment_method",
        "metadata",
      ]),
      ...this.advanced,
    });
  },
};
