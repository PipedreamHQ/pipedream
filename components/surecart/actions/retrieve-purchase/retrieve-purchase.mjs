import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-purchase",
  name: "Retrieve Purchase",
  description: "Retrieve a purchase by ID. [See the documentation](https://developer.surecart.com/api-reference/purchases/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    purchaseId: {
      propDefinition: [
        surecart,
        "purchaseId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getPurchase({
      $,
      purchaseId: this.purchaseId,
    });
    $.export("$summary", `Successfully retrieved purchase ${this.purchaseId}`);
    return response;
  },
};
