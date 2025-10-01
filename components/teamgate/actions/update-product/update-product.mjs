import teamgate from "../../teamgate.app.mjs";

export default {
  key: "teamgate-update-product",
  name: "Update Product",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      propDefinition: [
        teamgate,
        "sku",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        teamgate,
        "productDescription",
      ],
      optional: true,
    },
    category: {
      propDefinition: [
        teamgate,
        "productCategory",
      ],
      optional: true,
    },
    isActive: {
      propDefinition: [
        teamgate,
        "isActive",
      ],
      optional: true,
    },
    costValue: {
      propDefinition: [
        teamgate,
        "costValue",
      ],
      optional: true,
    },
    costCurrency: {
      propDefinition: [
        teamgate,
        "costCurrency",
      ],
      optional: true,
    },
    prices: {
      propDefinition: [
        teamgate,
        "prices",
      ],
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
      category,
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
      category,
      isActive,
      cost: {
        value: costValue,
        currency: costCurrency,
      },
      prices: prices && prices.map((item) => (JSON.parse(item))),
      customFields,
    };

    const response = await this.teamgate.updateProduct({
      $,
      productId,
      data,
    });

    $.export("$summary", "Product Successfully updated!");
    return response;
  },
};
