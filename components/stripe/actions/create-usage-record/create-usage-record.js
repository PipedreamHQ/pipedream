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
      ],
    },
    // Required to select subscription item
    subscription: {
      "propDefinition": [
        stripe,
        "subscription",
      ],
      "optional": false,
    },
    id: {
      "propDefinition": [
        stripe,
        "subscription_item",
      ],
      "optional": false,
    },
    timestamp: {
      "propDefinition": [
        stripe,
        "timestamp",
      ],
      "optional": false,
      "description": "The timestamp for the usage event. This timestamp must be within the " +
        "current billing period of the subscription of the provided subscription item.",
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
