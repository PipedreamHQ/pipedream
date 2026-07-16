import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-refund",
  name: "Retrieve Refund",
  description: "Retrieve a refund by ID. [See the documentation](https://developer.surecart.com/api-reference/refunds/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    refundId: {
      propDefinition: [
        surecart,
        "refundId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getRefund({
      $,
      refundId: this.refundId,
    });
    $.export("$summary", `Successfully retrieved refund ${this.refundId}`);
    return response;
  },
};
