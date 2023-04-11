import app from "../../megaventory.app.mjs";

export default {
  key: "megaventory-insert-or-update-product",
  name: "Insert Or Update Product",
  description: "Insert or update a product in the database. [See the docs](https://api.megaventory.com/v2017a/documentation/index.html#!/Product/postProductProductUpdate_post_11).",
  type: "action",
  version: "0.0.5",
  props: {
    app,
    productSKU: {
      type: "string",
      label: "Product SKU",
      description: "The SKU of the product.",
    },
    productId: {
      type: "integer",
      label: "Product ID",
      description: "The ID of the product to update. If the product does not exist, it will be created.",
      optional: true,
    },
    productType: {
      type: "string",
      label: "Product Type",
      description: "The type of the product.",
      optional: true,
    },
    productDescription: {
      type: "string",
      label: "Product Description",
      description: "The description of the product.",
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
      return this.app.create({
        path: "/Product/ProductUpdate",
        data: {
          mvRecordAction: "InsertOrUpdate",
          ...data,
        },
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      productSKU,
      productId,
      productType,
      productDescription,
      productVersion,
    } = this;

    const response = await this.insertOrUpdateProduct({
      step,
      data: {
        mvProduct: {
          ProductSKU: productSKU,
          ProductID: productId,
          ProductType: productType,
          ProductDescription: productDescription,
          ProductVersion: productVersion,
        },
      },
    });

    step.export("$summary", `Successfully inserted or updated product with ID ${productId}`);

    return response;
  },
};
