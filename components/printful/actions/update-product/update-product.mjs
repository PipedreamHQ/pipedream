import printful from "../../printful.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "printful-update-product",
  name: "Update Product",
  description: "Updates an existing product in your Printful store. [See the documentation](https://developers.printful.com/docs/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    printful,
    productId: {
      propDefinition: [
        printful,
        "productId",
      ],
    },
    updateFields: {
      propDefinition: [
        printful,
        "updateFields",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.printful.updateProduct({
      productId: this.productId,
      updateFields: this.updateFields,
    });
    $.export("$summary", `Updated product ${this.productId}`);
    return response;
  },
};
