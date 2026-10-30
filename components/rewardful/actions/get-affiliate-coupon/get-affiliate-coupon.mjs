import rewardful from "../../rewardful.app.mjs";

export default {
  key: "rewardful-get-affiliate-coupon",
  name: "Get Affiliate Coupon",
  description: "Retrieve a single affiliate coupon by ID, including its code and lead and conversion counts. Use **List Affiliate Coupons** to find the coupon ID. [See the documentation](https://developers.rewardful.com/rest-api/affiliate-coupons/retrieve-affiliate-coupon)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rewardful,
    affiliateCouponId: {
      propDefinition: [
        rewardful,
        "affiliateCouponId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rewardful.getAffiliateCoupon({
      $,
      affiliateCouponId: this.affiliateCouponId,
    });
    $.export("$summary", `Successfully retrieved affiliate coupon ${response.token ?? this.affiliateCouponId}`);
    return response;
  },
};
