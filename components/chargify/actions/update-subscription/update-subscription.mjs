import chargify from "../../chargify.app.mjs";

export default {
  key: "chargify-update-subscription",
  name: "Update Subscription",
  description: "Modifies an existing subscription in Chargify. [See the documentation](https://developers.maxio.com/http/advanced-billing-api/api-endpoints/subscriptions/update-subscription)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      optional: true,
    },
    couponCode: {
      propDefinition: [
        chargify,
        "couponCode",
      ],
    },
    nextBillingAt: {
      propDefinition: [
        chargify,
        "nextBillingAt",
      ],
    },
    paymentCollectionMethod: {
      propDefinition: [
        chargify,
        "paymentCollectionMethod",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chargify.updateSubscription({
      $,
      subscriptionId: this.subscriptionId,
      data: {
        subscription: {
          product_id: this.productId,
          coupon_code: this.couponCode,
          next_billing_at: this.nextBillingAt,
          payment_collection_method: this.paymentCollectionMethod,
        },
      },
    });
    $.export("$summary", `Successfully updated subscription ${this.subscriptionId}`);
    return response;
  },
};
