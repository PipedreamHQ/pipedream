import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-delete-promotion",
  name: "Delete Promotion",
  description: "Delete a promotion by ID. [See the documentation](https://developer.surecart.com/api-reference/promotions/delete)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
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
  },
  async run({ $ }) {
    const response = await this.surecart.deletePromotion({
      $,
      promotionId: this.promotionId,
    });
    $.export("$summary", `Successfully deleted promotion ${this.promotionId}`);
    return response;
  },
};
