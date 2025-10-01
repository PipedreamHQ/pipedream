import app from "../../megaventory.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "megaventory-insert-or-update-product",
  name: "Insert Or Update Product",
  description: "Insert or update a product in the database. [See the docs](https://api.megaventory.com/v2017a/documentation/index.html#!/Product/postProductProductUpdate_post_11).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    productSKU: {
      type: "string",
      label: "Product SKU",
      description: "The SKU of the product to update. If the product does not exist, it will be created.",
      propDefinition: [
        app,
        "product",
        () => ({
          mapper: ({
            ProductSKU: value, ProductDescription: label,
          }) => ({
            label,
            value,
          }),
        }),
      ],
    },
    productDescription: {
      type: "string",
      label: "Product Description",
      description: "The description of the product.",
    },
    productType: {
      type: "string",
      label: "Product Type",
      description: "The type of the product.",
      optional: true,
    },
    productVersion: {
      type: "string",
      label: "Product Version",
      description: "The version of the product.",
      optional: true,
    },
  },
  methods: {
    insertOrUpdateProduct({
      data, ...args
    } = {}) {
      return this.app.post({
        path: "/Product/ProductUpdate",
        data: {
          mvRecordAction: constants.MV_RECORD_ACTION.INSERT_OR_UPDATE_NON_EMPTY_FIELDS,
          ...data,
        },
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      productSKU,
      productType,
      productDescription,
      productVersion,
    } = this;

    const response = await this.insertOrUpdateProduct({
      step,
      data: {
        mvProduct: {
          ProductSKU: productSKU,
          ProductType: productType,
          ProductDescription: productDescription,
          ProductVersion: productVersion,
        },
      },
    });

    step.export("$summary", `Successfully inserted or updated product with ID ${response.mvProduct.ProductID}.`);

    return response;
  },
};
