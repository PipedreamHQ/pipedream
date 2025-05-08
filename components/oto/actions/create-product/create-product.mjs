import oto from "../../oto.app.mjs";

export default {
  key: "oto-create-product",
  name: "Create Product",
  description: "Creates a new product. [See the documentation](https://apis.tryoto.com/#21b289bc-04c1-49b1-993e-23e928d57f56)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    oto,
  },
  async run({ $ }) {
    const response = await this.oto.createProduct({});
    $.export("$summary", "");
    return response;
  },
};
