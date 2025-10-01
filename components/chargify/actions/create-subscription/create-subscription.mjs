import chargify from "../../chargify.app.mjs";

export default {
  key: "chargify-create-subscription",
  name: "Create Subscription",
  description: "Establishes a new subscription for a given customer in Chargify. [See the documentation](https://developers.maxio.com/http/advanced-billing-api/api-endpoints/subscriptions/create-subscription)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    chargify,
    customerId: {
      propDefinition: [
        chargify,
        "customerId",
      ],
    },
    productId: {
      propDefinition: [
        chargify,
        "productId",
      ],
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
    const response = await this.chargify.createSubscription({
      $,
      data: {
        subscription: {
          customer_id: this.customerId,
          product_id: this.productId,
          coupon_code: this.couponCode,
          next_billing_at: this.nextBillingAt,
          payment_collection_method: this.paymentCollectionMethod,
        },
      },
    });
    $.export("$summary", `Successfully created subscription with ID: ${response.subscription.id}`);
    return response;
  },
};
