const pick = require("lodash.pick");
const { STRIPE_PRICE_TYPE } = require("../../constants.js");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-create-usage-record",
  name: "Create a Usage Record",
  type: "action",
  version: "0.0.2",
  description: "With metered billing, you charge your customers based on their consumption of " +
    "your service during the billing cycle, instead of explicitly setting quantities. Use this " +
    " action to create a usage record for metered billing. [See the " +
    "docs](https://stripe.com/docs/api/usage_records/create) for more information",
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
          type: STRIPE_PRICE_TYPE.RECURRING,
        }),
      ],
    },
    // Required to select subscription item
    subscription: {
      "propDefinition": [
        stripe,
        "subscription",
        ({
          customer, price,
        }) => ({
          customer,
          price,
        }),
      ],
      "optional": false,
    },
    id: {
      "propDefinition": [
        stripe,
        "subscription_item",
        ({ subscription }) => ({
          subscription,
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
  async run({ $ }) {
    const data = pick(this, [
      "timestamp",
      "quantity",
      "action",
    ]);
    const resp = await this.stripe.sdk().subscriptionItems.createUsageRecord(this.id, data);
    $.export("$summary", `Successfully created a new usage record for subscription item, 
    "${resp.subscription_item}", with a usage quantity of ${resp.quantity}`);
    return resp;
  },
};
