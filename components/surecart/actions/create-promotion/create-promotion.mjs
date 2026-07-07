import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-create-promotion",
  name: "Create Promotion",
  description: "Create a new promotion. [See the documentation](https://developer.surecart.com/api-reference/promotions/create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    coupon: {
      propDefinition: [
        surecart,
        "promotionCoupon",
      ],
    },
    code: {
      propDefinition: [
        surecart,
        "promotionCode",
      ],
    },
    maxRedemptions: {
      propDefinition: [
        surecart,
        "promotionMaxRedemptions",
      ],
    },
    redeemBy: {
      propDefinition: [
        surecart,
        "promotionRedeemBy",
      ],
    },
    customer: {
      propDefinition: [
        surecart,
        "promotionCustomer",
      ],
    },
    archived: {
      propDefinition: [
        surecart,
        "promotionArchived",
      ],
    },
    metadata: {
      propDefinition: [
        surecart,
        "promotionMetadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.createPromotion({
      $,
      data: {
        promotion: {
          coupon: this.coupon,
          code: this.code,
          max_redemptions: this.maxRedemptions,
          redeem_by: this.redeemBy,
          customer: this.customer,
          archived: this.archived,
          metadata: this.metadata,
        },
      },
    });
    $.export("$summary", `Successfully created promotion ${response.id}`);
    return response;
  },
};
