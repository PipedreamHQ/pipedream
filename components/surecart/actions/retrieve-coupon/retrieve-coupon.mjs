import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-coupon",
  name: "Retrieve Coupon",
  description: "Retrieve a single coupon by its ID. Run **List Coupons** first to obtain a valid coupon ID. [See the documentation](https://developer.surecart.com/api-reference/coupons/retrieve)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    couponId: {
      propDefinition: [
        surecart,
        "couponId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getCoupon({
      $,
      couponId: this.couponId,
    });
    $.export("$summary", `Successfully retrieved coupon ${this.couponId}`);
    return response;
  },
};
