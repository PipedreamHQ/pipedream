import pick from "lodash.pick";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-create-invoice",
  name: "Create Invoice",
  type: "action",
  version: "0.1.0",
  description: "Create an invoice. [See the docs](https://stripe.com/docs/api/invoices/create) " +
    "for more information",
  props: {
    app,
    customer: {
      propDefinition: [
        app,
        "customer",
      ],
      optional: false,
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
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    auto_advance: {
      propDefinition: [
        app,
        "invoice_auto_advance",
      ],
    },
    collection_method: {
      propDefinition: [
        app,
        "invoice_collection_method",
      ],
      default: "charge_automatically",
      description: "When charging automatically, Stripe will attempt to pay this invoice using the default source attached to the customer. When sending an invoice, Stripe will email this invoice to the customer with payment instructions.",
    },
    days_until_due: {
      propDefinition: [
        app,
        "invoice_days_until_due",
      ],
    },
    default_payment_method: {
      propDefinition: [
        app,
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
    const resp = await this.app.sdk().invoices.create({
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
