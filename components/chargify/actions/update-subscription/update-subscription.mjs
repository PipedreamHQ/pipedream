import chargify from "../../chargify.app.mjs";

export default {
  key: "chargify-update-subscription",
  name: "Update Subscription",
  description: "Modifies an existing subscription in Chargify using its unique 'subscription_id'.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    chargify,
    subscriptionId: {
      propDefinition: [
        chargify,
        "subscriptionId",
      ],
    },
    productId: {
      propDefinition: [
        chargify,
        "productId",
      ],
    },
    nextBillingAt: {
      propDefinition: [
        chargify,
        "nextBillingAt",
      ],
    },
    couponCode: {
      propDefinition: [
        chargify,
        "couponCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chargify.updateSubscription({
      subscriptionId: this.subscriptionId,
      data: {
        subscription: {
          product_id: this.productId,
          next_billing_at: this.nextBillingAt,
          coupon_code: this.couponCode,
        },
      },
    });
    $.export("$summary", `Successfully updated subscription ${this.subscriptionId}`);
    return response;
  },
};