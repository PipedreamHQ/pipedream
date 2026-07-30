import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-refund-item",
  name: "Retrieve Refund Item",
  description: "Retrieve a refund item by ID. [See the documentation](https://developer.surecart.com/api-reference/refund-items/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    refundItemId: {
      propDefinition: [
        surecart,
        "refundItemId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getRefundItem({
      $,
      refundItemId: this.refundItemId,
    });
    $.export("$summary", `Successfully retrieved refund item ${this.refundItemId}`);
    return response;
  },
};
