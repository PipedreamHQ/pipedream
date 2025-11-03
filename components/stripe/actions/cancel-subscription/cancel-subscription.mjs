import stripe from "../../stripe.app.mjs";

export default {
  key: "stripe-cancel-subscription",
  name: "Cancel Subscription",
  description: "Cancel a subscription. [See the documentation](https://docs.stripe.com/api/subscriptions/cancel?lang=node)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    stripe,
    subscriptionId: {
      propDefinition: [
        stripe,
        "subscription",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.stripe.sdk().subscriptions.cancel(this.subscriptionId);

    $.export("$summary", `Cancelled subscription ${this.subscriptionId}`);

    return response;
  },
};
