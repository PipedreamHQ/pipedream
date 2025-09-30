import teamgate from "../../teamgate.app.mjs";

export default {
  key: "teamgate-create-product",
  name: "Create Product",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new product. [See the docs here](https://developers.teamgate.com/#873140c7-0c14-4461-a9c9-88c8e6c39adc)",
  type: "action",
  props: {
    teamgate,
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
    productDescription: {
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
      name,
      sku,
      productDescription,
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
      description: productDescription,
      category,
      isActive,
      cost: {
        value: costValue,
        currency: costCurrency,
      },
      prices: prices && prices.map((item) => (JSON.parse(item))),
      customFields,
    };

    const response = await this.teamgate.createProduct({
      $,
      data,
    });

    $.export("$summary", "Product Successfully created!");
    return response;
  },
};
