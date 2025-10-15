import altoviz from "../../altoviz.app.mjs";

export default {
  key: "altoviz-create-product",
  name: "Create Product",
  description: "Creates a new product in Altoviz. [See the documentation](https://developer.altoviz.com/api#tag/Products/operation/POST_Products_Post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    altoviz,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the product",
    },
    number: {
      type: "string",
      label: "Number",
      description: "The product number",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the product",
      optional: true,
    },
    price: {
      type: "string",
      label: "Price",
      description: "Price of the product",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.altoviz.createProduct({
      $,
      data: {
        name: this.name,
        number: this.number,
        description: this.description,
        purchasePrice: this.price,
      },
    });
    $.export("$summary", `Successfully created product with ID: ${response.id}`);
    return response;
  },
};
