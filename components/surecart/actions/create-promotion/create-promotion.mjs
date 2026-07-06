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
      type: "string",
      label: "Coupon ID",
      description: "The UUID of the coupon this promotion applies. Use **List Coupons** to find coupon IDs.",
    },
    code: {
      type: "string",
      label: "Code",
      description: "The customer-facing code. Auto-generated if omitted. Must be unique across the account. Example: `SUMMER10`",
      optional: true,
    },
    maxRedemptions: {
      type: "integer",
      label: "Max Redemptions",
      description: "Max total redemptions across all customers.",
      min: 1,
      optional: true,
    },
    redeemBy: {
      type: "integer",
      label: "Redeem By",
      description: "Unix timestamp after which the code can no longer be redeemed.",
      optional: true,
    },
    customer: {
      type: "string",
      label: "Customer ID",
      description: "Restrict the promotion to a specific customer UUID.",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Set to `true` to archive the promotion.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional key-value metadata. Example: `{ \"internal_id\": \"123\" }`",
      optional: true,
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
