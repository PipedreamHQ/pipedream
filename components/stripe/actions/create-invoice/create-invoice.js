const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-create-invoice",
  name: "Create Invoice",
  type: "action",
  version: "0.0.2",
  description: "Create an invoice. [See the docs](https://stripe.com/docs/api/invoices/create) " +
    "for more information",
  props: {
    stripe,
    customer: {
      propDefinition: [
        stripe,
        "customer",
      ],
      optional: false,
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
      default: "charge_automatically",
      description: "When charging automatically, Stripe will attempt to pay this invoice using the default source attached to the customer. When sending an invoice, Stripe will email this invoice to the customer with payment instructions.",
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
        ({ customer }) => ({
          customer,
        }),
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
  async run({ $ }) {
    const resp = await this.stripe.sdk().invoices.create({
      ...pick(this, [
        "customer",
        "subscription",
        "auto_advance",
        "description",
        "collection_method",
        "days_until_due",
        "default_payment_method",
        "metadata",
      ]),
      ...this.advanced,
    });

    $.export("$summary", "Successfully created a new invoice");

    return resp;
  },
};
