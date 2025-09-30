import oto from "../../oto.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "oto-create-product",
  name: "Create Product",
  description: "Creates a new product. [See the documentation](https://apis.tryoto.com/#21b289bc-04c1-49b1-993e-23e928d57f56)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    oto,
    sku: {
      type: "string",
      label: "Sku",
      description: "SKU of the product",
    },
    productName: {
      type: "string",
      label: "Product Name",
      description: "Name of the product",
    },
    price: {
      type: "string",
      label: "Price",
      description: "Price of the product",
    },
    taxAmount: {
      type: "string",
      label: "Tax Amount",
      description: "Tax Amount of the product",
    },
    brandId: {
      propDefinition: [
        oto,
        "brandId",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the product",
      optional: true,
    },
    barcode: {
      type: "string",
      label: "Barcode",
      description: "Barcode of the product",
      optional: true,
    },
    secondBarcode: {
      type: "string",
      label: "Second Barcode",
      description: "Second Barcode of the product",
      optional: true,
    },
    productImage: {
      type: "string",
      label: "Product Image",
      description: "Image Link of the product",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "Category of the product",
      optional: true,
    },
    hsCode: {
      type: "string",
      label: "HS Code",
      description: "A standardized numerical method of classifying traded products",
      optional: true,
    },
    itemOrigin: {
      type: "string",
      label: "Item Origin",
      description: "Origin of the product",
      optional: true,
    },
    customAttributes: {
      type: "object",
      label: "Custom Attributes",
      description: "Custom attributes of the product specified as a JSON Array of objects with keys `attributeName` and `attributeValue`. Example: `[{ \"attributeName\": \"112\", \"attributeValue\": \"test product\"}]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.oto.createProduct({
      $,
      data: {
        sku: this.sku,
        productName: this.productName,
        price: this.price,
        taxAmount: this.taxAmount,
        brandId: this.brandId,
        description: this.description,
        barcode: this.barcode,
        secondBarcode: this.secondBarcode,
        productImage: this.productImage,
        category: this.category,
        hsCode: this.hsCode,
        itemOrigin: this.itemOrigin,
        customAttributes: parseObject(this.customAttributes),
      },
    });
    if (response.productId) {
      $.export("$summary", `Successfully created product with ID: ${response.productId}`);
    }
    return response;
  },
};
