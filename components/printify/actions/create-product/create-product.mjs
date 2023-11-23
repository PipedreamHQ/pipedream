import printify from "../../printify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "printify-create-product",
  name: "Create a Product",
  description: "Creates a new product on Printify. [See the documentation](https://developers.printify.com/#create-a-new-product)",
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
    productBlueprint: {
      propDefinition: [
        printify,
        "productBlueprint",
      ],
    },
    productDetails: {
      propDefinition: [
        printify,
        "productDetails",
      ],
    },
    images: {
      propDefinition: [
        printify,
        "images",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.printify.createProduct({
      shopId: this.shopId,
      productBlueprint: this.productBlueprint,
      productDetails: this.productDetails,
      images: this.images,
    });

    $.export("$summary", `Successfully created a new product with blueprint ID ${this.productBlueprint.id}`);
    return response;
  },
};
