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
      type: "string",
      label: "Name",
      description: "The coupon name. Example: `Summer Sale`",
      optional: true,
    },
    amountOff: {
      type: "integer",
      label: "Amount Off",
      description: "Amount off the subtotal, in cents. Provide either this or Percent Off. Example: `500` for $5.00",
      optional: true,
    },
    percentOff: {
      type: "integer",
      label: "Percent Off",
      description: "Percentage off the subtotal. Provide either this or Amount Off. Example: `10`",
      optional: true,
    },
    duration: {
      type: "string",
      label: "Duration",
      description: "How long the discount applies to subscriptions. Defaults to `once`.",
      optional: true,
      options: [
        "once",
        "forever",
        "repeating",
      ],
    },
    durationInMonths: {
      type: "integer",
      label: "Duration In Months",
      description: "If Duration is `repeating`, the number of months the coupon applies. Example: `3`",
      min: 1,
      optional: true,
    },
    maxRedemptions: {
      type: "integer",
      label: "Max Redemptions",
      description: "Max total redemptions across all customers.",
      min: 1,
      optional: true,
    },
    maxRedemptionsPerCustomer: {
      type: "integer",
      label: "Max Redemptions Per Customer",
      description: "Max redemptions per customer.",
      min: 1,
      optional: true,
    },
    maxSubtotalAmount: {
      type: "integer",
      label: "Max Subtotal Amount",
      description: "Max checkout subtotal in cents for the coupon to apply.",
      optional: true,
    },
    minSubtotalAmount: {
      type: "integer",
      label: "Min Subtotal Amount",
      description: "Min checkout subtotal in cents required for the coupon to apply.",
      optional: true,
    },
    productIds: {
      type: "string[]",
      label: "Product IDs",
      description: "Restrict the coupon to specific product UUIDs.",
      optional: true,
    },
    redeemBy: {
      type: "integer",
      label: "Redeem By",
      description: "Unix timestamp after which the coupon can no longer be redeemed. Example: `1735689600`",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Set to `true` to archive the coupon.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional key-value metadata.",
      optional: true,
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
