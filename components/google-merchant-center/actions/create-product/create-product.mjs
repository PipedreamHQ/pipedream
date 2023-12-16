import { axios } from "@pipedream/platform";
import googleShopping from "../../google-merchant-center.app.mjs";

export default {
  key: "google-merchant-center-create-product",
  name: "Create Product",
  description: "Creates a new product in your Google Merchant Center account. [See the documentation](https://developers.google.com/shopping-content/reference/rest/v2.1/products/insert)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    googleShopping,
    merchantId: {
      propDefinition: [
        googleShopping,
        "merchantId",
      ],
    },
    product: {
      type: "object",
      label: "Product",
      description: "The product information to create.",
    },
  },
  async run({ $ }) {
    const response = await this.googleShopping._makeRequest({
      method: "POST",
      path: `/${this.merchantId}/products`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.googleShopping.$auth.oauth_access_token}`,
      },
      data: this.product,
    });
    $.export("$summary", `Successfully created product with ID: ${response.id || response.offerId}`);
    return response;
  },
};