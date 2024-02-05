import altoviz from "../../altoviz.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "altoviz-find-or-create-products",
  name: "Find or Create Products",
  description: "Finds a product in Altoviz using the 'productnumber' prop. If not found, creates a new product. Other optional props for creation include 'name', 'description', and 'price'.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    altoviz,
    productNumber: {
      type: "string",
      label: "Product Number",
      description: "The number of the product",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the product",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the product",
      optional: true,
    },
    price: {
      type: "number",
      label: "Price",
      description: "Price of the product",
      optional: true,
    },
  },
  async run({ $ }) {
    const product = {
      productNumber: this.productNumber,
      name: this.name,
      description: this.description,
      price: this.price,
    };

    const response = await this.altoviz.findOrCreateProduct(product);
    $.export("$summary", `Product ${product.name} found or created successfully`);
    return response;
  },
};
