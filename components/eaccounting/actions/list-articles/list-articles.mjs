import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-list-articles",
  name: "List Articles",
  description: "Retrieves a list of articles. [See the documentation](https://developer.vismaonline.com)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    showPricesWithTwoDecimals: {
      type: "boolean",
      label: "Show Prices With Two Decimals",
      description: "Show prices with two decimals",
      optional: true,
    },
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
      optional: true,
      description: "Customer ID for price calculations. If customerId is provided, then article prices and discounts will be returned based on which pricelist and discount agreement is assigned to customer.",
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.app.listArticles({
      $,
      params: {
        showPricesWithTwoDecimals: this.showPricesWithTwoDecimals,
        customerId: this.customerId,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} articles`);
    return response;
  },
};
