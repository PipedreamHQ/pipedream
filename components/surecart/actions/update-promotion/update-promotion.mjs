import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-update-promotion",
  name: "Update Promotion",
  description: "Update an existing promotion. [See the documentation](https://developer.surecart.com/api-reference/promotions/update)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    promotionId: {
      propDefinition: [
        surecart,
        "promotionId",
      ],
    },
    coupon: {
      propDefinition: [
        surecart,
        "promotionCoupon",
      ],
      optional: true,
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
    const response = await this.surecart.updatePromotion({
      $,
      promotionId: this.promotionId,
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
    $.export("$summary", `Successfully updated promotion ${this.promotionId}`);
    return response;
  },
};
