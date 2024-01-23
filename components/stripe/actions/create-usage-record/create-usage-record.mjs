import pick from "lodash.pick";
import app from "../../stripe.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "stripe-create-usage-record",
  name: "Create a Usage Record",
  type: "action",
  version: "0.1.0",
  description: "With metered billing, you charge your customers based on their consumption of " +
    "your service during the billing cycle, instead of explicitly setting quantities. Use this " +
    " action to create a usage record for metered billing. [See the " +
    "docs](https://stripe.com/docs/api/usage_records/create) for more information",
  props: {
    app,
    // Used to filter subscription
    customer: {
      "propDefinition": [
        app,
        "customer",
      ],
    },
    // Used to filter subscription
    price: {
      "propDefinition": [
        app,
        "price",
        () => ({
          // Only `recurring` prices can be used to filter subscriptions
          type: constants.STRIPE_PRICE_TYPE.RECURRING,
        }),
      ],
    },
    // Required to select subscription item
    subscription: {
      "propDefinition": [
        app,
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
        app,
        "subscription_item",
        ({ subscription }) => ({
          subscription,
        }),
      ],
      "optional": false,
    },
    timestamp: {
      "propDefinition": [
        app,
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
        app,
        "quantity",
      ],
      "optional": false,
      "description": "The usage quantity for the specified timestamp",
    },
    action: {
      propDefinition: [
        app,
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
    const resp = await this.app.sdk().subscriptionItems.createUsageRecord(this.id, data);
    $.export("$summary", `Successfully created a new usage record for subscription item, 
    "${resp.subscription_item}", with a usage quantity of ${resp.quantity}`);
    return resp;
  },
};
