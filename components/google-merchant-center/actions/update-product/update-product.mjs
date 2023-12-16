import googleShopping from "../../google-merchant-center.app.mjs";

export default {
  key: "google-merchant-center-update-product",
  name: "Update Product",
  description: "Update an existing product in your Google Merchant Center account. [See the documentation](https://developers.google.com/shopping-content/reference/rest/v2.1/products/update)",
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
    productId: {
      propDefinition: [
        googleShopping,
        "productId",
        {
          options: ({ merchantId }) => {
            return googleShopping.listProducts({ merchantId });
          },
        },
      ],
    },
    product: {
      propDefinition: [
        googleShopping,
        "product",
        (c) => ({ productId: c.productId, merchantId: c.merchantId }),
      ],
      type: "object",
      label: "Product",
      description: "The product information to be updated.",
    },
    updateMask: {
      propDefinition: [
        googleShopping,
        "updateMask",
      ],
      type: "string[]",
      label: "Update Mask",
      description: "The comma-separated list of product attributes to be updated.",
    },
  },
  async run({ $ }) {
    const updatedProduct = await this.googleShopping.updateProduct({
      merchantId: this.merchantId,
      productId: this.productId,
      product: this.product,
      updateMask: this.updateMask,
    });

    $.export("$summary", `Successfully updated product with ID ${this.productId}`);
    return updatedProduct;
  },
};