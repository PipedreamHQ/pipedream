import googleMerchant from "../../google_merchant_center.app.mjs";

export default {
  key: "google_merchant_center-update-product",
  name: "Update Product",
  description: "Updates an existing product in your Google Merchant Center account. [See the documentation](https://developers.google.com/shopping-content/reference/rest/v2.1/products/update)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleMerchant,
    productId: {
      propDefinition: [
        googleMerchant,
        "productId",
      ],
    },
    updatedValues: {
      type: "object",
      label: "Updated Values",
      description: "Values for the attributes to be updated. If a value is not a string, it will be parsed as JSON. [See the documentation here](https://developers.google.com/shopping-content/reference/rest/v2.1/products#Product)",
    },
    updateMask: {
      type: "string[]",
      label: "Update Mask",
      description: "The product attributes to be updated. Attributes specified without a value provided in `Updated Values` will be deleted from the product. If not defined, attributes in `Updated Values` will be updated and other attributes will stay unchanged.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      productId, updatedValues, updateMask,
    } = this;

    Object.entries(updatedValues ?? {}).forEach(([
      key,
      value,
    ]) => {
      try {
        updatedValues[key] = JSON.parse(value);
      } catch (e) {
        // ignore non-serializable values
      }
    });

    const response = await this.googleMerchant.updateProduct({
      $,
      productId,
      data: updatedValues,
      updateMask: updateMask?.join?.() ?? updateMask,
    });
    $.export("$summary", `Successfully updated product ${this.productId}`);
    return response;
  },
};
