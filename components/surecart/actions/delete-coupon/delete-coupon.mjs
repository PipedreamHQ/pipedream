import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-delete-coupon",
  name: "Delete Coupon",
  description: "Delete a coupon by ID. [See the documentation](https://developer.surecart.com/api-reference/coupons/delete)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
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
  },
  async run({ $ }) {
    const response = await this.surecart.deleteCoupon({
      $,
      couponId: this.couponId,
    });
    $.export("$summary", `Successfully deleted coupon ${this.couponId}`);
    return response;
  },
};
