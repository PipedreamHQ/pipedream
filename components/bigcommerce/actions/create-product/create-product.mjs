import bigcommerce from "../../bigcommerce.app.mjs";
import productProps from "../../common/product-props.mjs";

export default {
  key: "bigcommerce-create-product",
  name: "Create Product",
  description:
    "Create a product. [See the docs here](https://developer.bigcommerce.com/api-reference/366928572e59e-create-a-product)",
  version: "0.0.2",
  type: "action",
  props: {
    bigcommerce,
    ...productProps,
  },
  async run({ $ }) {
    const {
      bigcommerce, ...props
    } = this;
    const response = await bigcommerce.createProduct({
      $,
      props,
    });

    $.export("$summary", `Successfully created product ${this.name}`);
    return response.data;
  },
};
