import { toProductOption } from "../../common/utils.mjs";
import google_merchant_center from "../../google_merchant_center.app.mjs";

export default {
  key: "google_merchant_center-list-product-id-options",
  name: "List Product ID Options",
  description: "Lists all products in your Google Merchant Center account as Product ID options. Use it to find the **Product ID** for updating a product. Returns each product's ID and title. [See the documentation](https://developers.google.com/merchant/api/reference/rest/products_v1/accounts.products/list)",
  version: "0.1.0",
  ai: "optimized",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    google_merchant_center,
  },
  async run({ $ }) {
    const options = [];
    for await (const product of this.google_merchant_center.paginateProducts({
      $,
    })) {
      options.push(toProductOption(product));
    }
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
