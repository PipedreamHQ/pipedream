import printify from "../../printify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "printify-update-product",
  name: "Update Product",
  description: "Updates an existing product on Printify. [See the documentation](https://developers.printify.com/#update-a-product)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    printify,
    shopId: {
      propDefinition: [
        printify,
        "shopId",
      ],
    },
    productId: {
      propDefinition: [
        printify,
        "productId",
      ],
    },
    productBlueprint: {
      propDefinition: [
        printify,
        "productBlueprint",
        (c) => ({
          productId: c.productId,
        }), // Assuming the productBlueprint depends on productId
      ],
      optional: true,
    },
    productDetails: {
      propDefinition: [
        printify,
        "productDetails",
        (c) => ({
          productId: c.productId,
        }), // Assuming the productDetails depends on productId
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.printify.updateProduct({
      shopId: this.shopId,
      productId: this.productId,
      productDetails: this.productDetails,
    });

    $.export("$summary", `Successfully updated product with ID: ${this.productId}`);
    return response;
  },
};
