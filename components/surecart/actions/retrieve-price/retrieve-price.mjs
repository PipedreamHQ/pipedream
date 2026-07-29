import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-price",
  name: "Retrieve Price",
  description: "Retrieve a single SureCart price by its ID. Run **List Prices** first to obtain a valid price ID. [See the documentation](https://developer.surecart.com/api-reference/prices/retrieve)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    surecart,
    priceId: {
      type: "string",
      label: "Price ID",
      description: "The ID of the price to retrieve. Run **List Prices** first to obtain valid price IDs. Example: `b47ca4c2-6cd2-41d5-aefb-4dc459642c56`.",
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getPrice({
      $,
      priceId: this.priceId,
    });
    $.export("$summary", `Successfully retrieved price ${this.priceId}`);
    return response;
  },
};
