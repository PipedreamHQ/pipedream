import rewardful from "../../rewardful.app.mjs";

export default {
  key: "rewardful-create-affiliate-coupon",
  name: "Create Affiliate Coupon",
  description: "Assign a coupon or promotion code to an affiliate so sales using it are attributed to them. The code must already exist in your payment processor (e.g. Stripe) with exactly the same spelling, otherwise sales are not tracked. Use **List Affiliates** to find the affiliate ID. [See the documentation](https://developers.rewardful.com/rest-api/affiliate-coupons/create-affiliate-coupon)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    rewardful,
    affiliateId: {
      propDefinition: [
        rewardful,
        "affiliateId",
      ],
    },
    code: {
      type: "string",
      label: "Coupon Code",
      description: "The coupon or promotion code, e.g. `SUMMER20`. Must match a code defined in your payment processor exactly.",
    },
  },
  async run({ $ }) {
    const response = await this.rewardful.createAffiliateCoupon({
      $,
      data: {
        affiliate_id: this.affiliateId,
        token: this.code,
      },
    });
    $.export("$summary", `Successfully created affiliate coupon ${response.token ?? response.id}`);
    return response;
  },
};
