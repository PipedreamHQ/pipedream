import googleMerchant from "../../google-merchant-center.app.mjs";

export default {
  key: "google-merchant-center-create-product",
  name: "Create Product",
  description: "Creates a product in your Google Merchant Center account. [See the documentation](https://developers.google.com/shopping-content/reference/rest/v2.1/products/insert)",
  version: "0.0.1",
  type: "action",
  props: {
    googleMerchant,
    merchantId: {
      propDefinition: [
        googleMerchant,
        "merchantId",
      ],
    },
    product: {
      propDefinition: [
        googleMerchant,
        "product",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.googleMerchant.createProduct({
      merchantId: this.merchantId,
      product: this.product,
    });
    $.export("$summary", `Product ${response.id} created successfully`);
    return response;
  },
};
