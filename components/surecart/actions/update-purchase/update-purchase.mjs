import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-update-purchase",
  name: "Update Purchase",
  description: "Update an existing purchase, such as scheduling a revocation. [See the documentation](https://developer.surecart.com/api-reference/purchases/update)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    purchaseId: {
      propDefinition: [
        surecart,
        "purchaseId",
      ],
    },
    revokeAt: {
      type: "integer",
      label: "Revoke At (Unix timestamp)",
      description: "Unix timestamp for when this purchase should be automatically revoked. Set to `null` to clear a previously scheduled revocation. Example: `1720000000`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.updatePurchase({
      $,
      purchaseId: this.purchaseId,
      data: {
        purchase: {
          revoke_at: this.revokeAt,
        },
      },
    });
    $.export("$summary", `Successfully updated purchase ${this.purchaseId}`);
    return response;
  },
};
