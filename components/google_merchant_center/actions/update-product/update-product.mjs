import {
  buildProductInputBody, parseObjectValues, toUpdateMask,
} from "../../common/utils.mjs";
import googleMerchant from "../../google_merchant_center.app.mjs";

export default {
  key: "google_merchant_center-update-product",
  name: "Update Product",
  description: "Updates an existing product in your Google Merchant Center account. It may take several minutes before the change is reflected in the processed product. [See the documentation](https://developers.google.com/merchant/api/reference/rest/products_v1/accounts.productInputs/patch)",
  version: "1.0.0",
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
    dataSourceId: {
      propDefinition: [
        googleMerchant,
        "dataSourceId",
      ],
      description: "The ID or full resource name of the API data source that holds the product input, e.g. `104628` or `accounts/123456/dataSources/104628`. Use **List Data Sources** to find valid values. If omitted, the product's primary data source is used; set this when updating a product created moments ago, since new products take a few minutes to become retrievable.",
      optional: true,
    },
    updatedValues: {
      type: "object",
      label: "Updated Values",
      description: "Product attributes to update, e.g. `{ \"title\": \"New Title\", \"availability\": \"OUT_OF_STOCK\" }`. Values that are JSON objects or arrays are parsed. Use the `customAttributes` key to update custom attributes. [See the documentation](https://developers.google.com/merchant/api/reference/rest/products_v1/ProductAttributes)",
    },
    updateMask: {
      type: "string[]",
      label: "Update Mask",
      description: "The product attributes to update, e.g. `title`. Attributes listed here without a value in `Updated Values` are deleted from the product. Prefix custom attributes with `customAttributes.`, e.g. `customAttributes.size`. If omitted, attributes in `Updated Values` are updated and all others stay unchanged.",
      optional: true,
    },
  },
  methods: {
    async getDataSource($) {
      if (this.dataSourceId) {
        return this.googleMerchant.dataSourceName(this.dataSourceId);
      }
      const { dataSource } = await this.googleMerchant.getProduct({
        $,
        productId: this.productId,
      });
      return dataSource;
    },
  },
  async run({ $ }) {
    const dataSource = await this.getDataSource($);

    const response = await this.googleMerchant.updateProduct({
      $,
      productId: this.productId,
      dataSource,
      updateMask: toUpdateMask(this.updateMask),
      data: buildProductInputBody(parseObjectValues(this.updatedValues)),
    });
    $.export("$summary", `Successfully updated product ${response.name}`);
    return response;
  },
};
