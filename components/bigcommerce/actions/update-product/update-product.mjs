import bigcommerce from "../../bigcommerce.app.mjs";
import productProps from "../../common/product-props.mjs";

export default {
  key: "bigcommerce-update-product",
  name: "Update Product",
  description:
    "Update a product by Id. [See the docs here](https://developer.bigcommerce.com/api-reference/6f05c1244d972-update-a-product)",
  version: "0.0.2",
  type: "action",
  props: {
    bigcommerce,
    productId: {
      propDefinition: [
        bigcommerce,
        "productId",
      ],
    },
    ...productProps,
  },
  async run({ $ }) {
    const {
      bigcommerce, ...props
    } = this;
    const response = await bigcommerce.updateProduct({
      $,
      props,
    });

    $.export("$summary", `Successfully updated product ${this.productId}`);
    return response.data;
  },
};
