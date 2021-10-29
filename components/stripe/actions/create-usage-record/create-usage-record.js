const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-create-usage-record",
  name: "Create a Usage Record",
  type: "action",
  version: "0.0.1",
  description: "With metered billing, you charge your customers based on their consumption of " +
    "your service during the billing cycle, instead of explicitly setting quantities. Use this " +
    " action to create a usage record for metered billing.",
  props: {
    stripe,
    // Used to filter subscription
    customer: {
      "propDefinition": [
        stripe,
        "customer",
      ],
    },
    // Used to filter subscription
    price: {
      "propDefinition": [
        stripe,
        "price",
        () => ({
          // Only `recurring` prices can be used to filter subscriptions
          type: "recurring",
        }),
      ],
    },
    // Required to select subscription item
    subscription: {
      "propDefinition": [
        stripe,
        "subscription",
        (configuredProps) => ({
          customer: configuredProps.customer,
          price: configuredProps.price,
        }),
      ],
      "optional": false,
    },
    id: {
      "propDefinition": [
        stripe,
        "subscription_item",
        (configuredProps) => ({
          subscription: configuredProps.subscription,
        }),
      ],
      "optional": false,
    },
    timestamp: {
      "propDefinition": [
        stripe,
        "timestamp",
      ],
      "optional": true,
      "description": "The timestamp for the usage event. This timestamp must be within the " +
        "current billing period of the subscription of the provided subscription item. When " +
        "passing `now`, Stripe records usage for the current time. Default is `now` if a value " +
        "is not provided.",
    },
    quantity: {
      "propDefinition": [
        stripe,
        "quantity",
      ],
      "optional": false,
      "description": "The usage quantity for the specified timestamp",
    },
    action: {
      propDefinition: [
        stripe,
        "usage_record_action",
      ],
    },
  },
  async run() {
    const data = pick(this, [
      "timestamp",
      "quantity",
      "action",
    ]);
    return await this.stripe.sdk().subscriptionItems.createUsageRecord(this.id, data);
  },
};
