import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-update-coupon",
  name: "Update Coupon",
  description: "Update an existing coupon. [See the documentation](https://developer.surecart.com/api-reference/coupons/update)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    couponId: {
      propDefinition: [
        surecart,
        "couponId",
      ],
    },
    name: {
      propDefinition: [
        surecart,
        "couponName",
      ],
      optional: true,
    },
    amountOff: {
      propDefinition: [
        surecart,
        "couponAmountOff",
      ],
    },
    percentOff: {
      propDefinition: [
        surecart,
        "couponPercentOff",
      ],
    },
    duration: {
      propDefinition: [
        surecart,
        "couponDuration",
      ],
    },
    durationInMonths: {
      propDefinition: [
        surecart,
        "couponDurationInMonths",
      ],
    },
    maxRedemptions: {
      propDefinition: [
        surecart,
        "couponMaxRedemptions",
      ],
    },
    maxRedemptionsPerCustomer: {
      propDefinition: [
        surecart,
        "couponMaxRedemptionsPerCustomer",
      ],
    },
    maxSubtotalAmount: {
      propDefinition: [
        surecart,
        "couponMaxSubtotalAmount",
      ],
    },
    minSubtotalAmount: {
      propDefinition: [
        surecart,
        "couponMinSubtotalAmount",
      ],
    },
    productIds: {
      propDefinition: [
        surecart,
        "couponProductIds",
      ],
    },
    redeemBy: {
      propDefinition: [
        surecart,
        "couponRedeemBy",
      ],
    },
    archived: {
      propDefinition: [
        surecart,
        "couponArchived",
      ],
    },
    metadata: {
      propDefinition: [
        surecart,
        "couponMetadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.updateCoupon({
      $,
      couponId: this.couponId,
      data: {
        coupon: {
          name: this.name,
          amount_off: this.amountOff,
          percent_off: this.percentOff,
          duration: this.duration,
          duration_in_months: this.durationInMonths,
          max_redemptions: this.maxRedemptions,
          max_redemptions_per_customer: this.maxRedemptionsPerCustomer,
          max_subtotal_amount: this.maxSubtotalAmount,
          min_subtotal_amount: this.minSubtotalAmount,
          product_ids: this.productIds,
          redeem_by: this.redeemBy,
          archived: this.archived,
          metadata: this.metadata,
        },
      },
    });
    $.export("$summary", `Successfully updated coupon ${this.couponId}`);
    return response;
  },
};
