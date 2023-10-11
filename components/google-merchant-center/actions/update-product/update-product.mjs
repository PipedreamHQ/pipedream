import googleMerchant from "../../google-merchant-center.app.mjs";

export default {
  key: "google-merchant-center-update-product",
  name: "Update Product",
  description: "Updates an existing product in your Merchant Center account. [See the documentation](https://developers.google.com/shopping-content/reference/rest/v2.1/products/update)",
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
    productId: {
      propDefinition: [
        googleMerchant,
        "productId",
        (c) => ({
          merchantId: c.merchantId,
        }),
      ],
    },
    product: {
      propDefinition: [
        googleMerchant,
        "product",
        (c) => ({
          productId: c.productId,
          merchantId: c.merchantId,
        }),
      ],
    },
    updatemask: {
      propDefinition: [
        googleMerchant,
        "updatemask",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.updateProduct({
      merchantId: this.merchantId,
      productId: this.productId,
      product: this.product,
      updatemask: this.updatemask,
    });
    $.export("$summary", `Successfully updated product ${this.productId}`);
    return response;
  },
};
