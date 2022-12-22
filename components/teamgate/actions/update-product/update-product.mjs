import teamgate from "../../teamgate.app.mjs";

export default {
  key: "teamgate-update-product",
  name: "Update Product",
  version: "0.0.1",
  description: "Update a specific product. [See the docs here](https://developers.teamgate.com/#873140c7-0c14-4461-a9c9-88c8e6c39adc)",
  type: "action",
  props: {
    teamgate,
    productId: {
      propDefinition: [
        teamgate,
        "productId",
      ],
    },
    name: {
      propDefinition: [
        teamgate,
        "name",
      ],
      description: "The product's name.",
    },
    sku: {
      type: "string",
      label: "SKU",
      description: "Unique identification code.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the product.",
      optional: true,
    },
    categoryId: {
      propDefinition: [
        teamgate,
        "productCategoryId",
      ],
      optional: true,
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Set product availability.",
      optional: true,
    },
    costValue: {
      type: "string",
      label: "Cost Value",
      description: "The product cost.",
      optional: true,
    },
    costCurrency: {
      type: "string",
      label: "Cost Currency",
      description: "The product currency.",
      optional: true,
    },
    prices: {
      type: "string[]",
      label: "Prices",
      description: "The product prices. Example for string value: `{\"value\":\"1600\", \"currency\":\"USD\"}` [Object format](https://developers.teamgate.com/#ec82024b-42a3-48eb-a048-f36f477724f6)",
      optional: true,
    },
    customFields: {
      propDefinition: [
        teamgate,
        "customFields",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      productId,
      name,
      sku,
      description,
      categoryId,
      isActive,
      costValue,
      costCurrency,
      prices,
      customFields,
    } = this;

    const data = {
      name,
      sku,
      description,
      categoryId,
      isActive,
      cost: {
        value: costValue,
        currency: costCurrency,
      },
      prices: prices.map((item) => (JSON.parse(item))),
      customFields,
    };

    const response = await this.teamgate.updateProduct({
      $,
      data,
    },
    productId);

    $.export("$summary", "Product Successfully updated!");
    return response;
  },
};
