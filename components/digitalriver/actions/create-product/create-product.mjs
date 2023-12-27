import digitalriver from "../../digitalriver.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "digitalriver-create-product",
  name: "Create a Product",
  description: "Creates a new product on the Digital River platform. [See the documentation](https://www.digitalriver.com/docs/digital-river-api-reference/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    digitalriver,
    productData: {
      propDefinition: [
        digitalriver,
        "productData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.digitalriver.createProduct({
      productData: this.productData,
    });

    $.export("$summary", `Successfully created product with ID: ${response.id}`);
    return response;
  },
};
