import wix from "../../wix_api_key.app.mjs";

export default {
  key: "wix_api_key-create-product",
  name: "Create Product",
  description: "Creates a new product. [See the documentation](https://dev.wix.com/api/rest/wix-stores/catalog/products/create-product)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wix,
    site: {
      propDefinition: [
        wix,
        "site",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new product",
    },
    price: {
      type: "string",
      label: "Price",
      description: "Price of the new product",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the new product",
      optional: true,
    },
    visible: {
      type: "boolean",
      label: "Visible",
      description: "Whether the product is visible to site visitors",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.wix.createProduct({
      siteId: this.site,
      data: {
        product: {
          name: this.name,
          description: this.description,
          priceData: {
            price: this.price,
          },
          visible: this.visible,
          productType: "physical",
        },
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created product with ID ${response.product.id}`);
    }

    return response;
  },
};
