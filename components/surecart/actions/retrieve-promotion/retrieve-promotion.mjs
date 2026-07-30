import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-promotion",
  name: "Retrieve Promotion",
  description: "Retrieve a single promotion by its ID. Run **List Promotions** first to obtain a valid promotion ID. [See the documentation](https://developer.surecart.com/api-reference/promotions/retrieve)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.surecart.getPromotion({
      $,
      promotionId: this.promotionId,
    });
    $.export("$summary", `Successfully retrieved promotion ${this.promotionId}`);
    return response;
  },
};
