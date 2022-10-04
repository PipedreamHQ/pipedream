import pick from "lodash.pick";
import stripe from "../../stripe.app.mjs";

export default {
  key: "stripe-create-subscription",
  name: "Create Subscription",
  type: "action",
  version: "0.0.1",
  description: "Create a subscription. [See docs here](https://stripe.com/docs/api/subscriptions/create)",
  props: {
    stripe,
    customer: {
      propDefinition: [
        stripe,
        "customer",
      ],
      optional: false,
    },
    items: {
      propDefinition: [
        stripe,
        "subscription_item",
      ],
      optional: false,
      type: "string[]",
    },
    currency: {
      propDefinition: [
        stripe,
        "currency",
      ],
    },
    description: {
      propDefinition: [
        stripe,
        "description",
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
  },
  async run({ $ }) {
    const resp = await this.stripe.sdk().subscriptions.create({
      ...pick(this, [
        "customer",
        "items",
        "currency",
        "description",
        "collection_method",
        "days_until_due",
        "default_payment_method",
        "metadata",
      ]),
      ...this.advanced,
    });

    $.export("$summary", `Successfully created a new subscription with id ${resp.id}`);

    return resp;
  },
};
