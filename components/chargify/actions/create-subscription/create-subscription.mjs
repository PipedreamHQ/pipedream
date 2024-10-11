js
import chargify from "../../chargify.app.mjs";

export default {
  key: "chargify-create-subscription",
  name: "Create Subscription",
  description: "Establishes a new subscription for a given customer in Chargify",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    chargify,
    customerId: {
      propDefinition: [
        chargify,
        "customerId"
      ]
    },
    productId: {
      propDefinition: [
        chargify,
        "productId"
      ]
    },
    couponCode: {
      propDefinition: [
        chargify,
        "couponCode"
      ],
      optional: true
    },
    nextBillingAt: {
      propDefinition: [
        chargify,
        "nextBillingAt"
      ],
      optional: true
    },
  },
  async run({ $ }) {
    const response = await this.chargify.createSubscription({
      data: {
        subscription: {
          customer_id: this.customerId,
          product_id: this.productId,
          coupon_code: this.couponCode,
          next_billing_at: this.nextBillingAt
        }
      }
    });
    $.export("$summary", `Successfully created subscription with ID: ${response.id}`);
    return response;
  },
};