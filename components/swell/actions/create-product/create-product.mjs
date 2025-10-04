import app from "../../swell.app.mjs";

export default {
  key: "swell-create-product",
  name: "Create Product",
  description: "Create a new product. [See the documentation](https://developers.swell.is/backend-api/products/create-a-product)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    price: {
      propDefinition: [
        app,
        "price",
      ],
    },
    active: {
      propDefinition: [
        app,
        "active",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    discontinued: {
      propDefinition: [
        app,
        "discontinued",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createProduct({
      $,
      data: {
        name: this.name,
        price: this.price,
        active: this.active,
        description: this.description,
        discontinued: this.discontinued,
      },
    });
    $.export("$summary", "Successfully created product with ID: " + response.id);
    return response;
  },
};
