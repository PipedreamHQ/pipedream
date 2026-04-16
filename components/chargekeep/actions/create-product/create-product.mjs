import chargekeep from "../../chargekeep.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "chargekeep-create-product",
  name: "Create Product",
  description: "Create a new product in Chargekeep. [See the documentation](https://crm.chargekeep.com/app/api/swagger)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    chargekeep,
    code: {
      type: "string",
      label: "Code",
      description: "Product SKU or unique code",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Product name",
    },
    currencyId: {
      propDefinition: [
        chargekeep,
        "currencyId",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "Product type",
      options: constants.PRODUCT_TYPES,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Product description",
      optional: true,
    },
    price: {
      type: "string",
      label: "Price",
      description: "Product price",
    },
    unit: {
      type: "string",
      label: "Unit",
      description: "Product unit",
      options: constants.UNIT_OPTIONS,
    },
    barcode: {
      type: "string",
      label: "Barcode",
      description: "Product barcode",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.chargekeep.createProduct({
      $,
      data: {
        code: this.code,
        name: this.name,
        currencyId: this.currencyId,
        type: this.type,
        description: this.description,
        price: this.price
          ? parseFloat(this.price)
          : undefined,
        unit: this.unit,
        barcode: this.barcode,
      },
    });
    $.export("$summary", `Successfully created product with ID ${response.result.productId}.`);
    return response;
  },
};
