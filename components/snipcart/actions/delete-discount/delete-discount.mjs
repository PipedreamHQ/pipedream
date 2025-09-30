import app from "../../snipcart.app.mjs";

export default {
  key: "snipcart-delete-discount",
  name: "Delete Discount",
  description: "Delete a Discount. [See the documentation](https://docs.snipcart.com/v3/api-reference/discounts#delete-discountsid)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    discountId: {
      propDefinition: [
        app,
        "discountId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteDiscount({
      $,
      id: this.discountId,
    });

    $.export("$summary", `Successfully deleted Discount with ID '${this.discountId}'`);

    return response;
  },
};
