import dingconnect from "../../dingconnect.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dingconnect-get-products",
  name: "Get Products",
  description: "Retrieves a list of products from DingConnect. [See the documentation](https://www.dingconnect.com/api#operation/getproducts)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dingconnect,
  },
  async run({ $ }) {
    const response = await this.dingconnect.getProducts();
    $.export("$summary", "Successfully retrieved the list of products");
    return response;
  },
};
