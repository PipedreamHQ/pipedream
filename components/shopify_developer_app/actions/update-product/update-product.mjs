import shopify from "../../shopify_developer_app.app.mjs";
import common from "../common/metafield-actions.mjs";
import utils from "@pipedream/shopify/common/utils.mjs";

export default {
  ...common,
  key: "shopify_developer_app-update-product",
  name: "Update Product",
  description: "Update an existing product. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/productupdate)",
  version: "0.0.7",
  type: "action",
  props: {
    shopify,
    productId: {
      propDefinition: [
        shopify,
        "productId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the new product",
      optional: true,
    },
    productDescription: {
      type: "string",
      label: "Product Description",
      description: "A description of the product. Supports HTML formatting. Example: `<strong>Good snowboard!</strong>`",
      optional: true,
    },
    vendor: {
      type: "string",
      label: "Vendor",
      description: "The name of the product's vendor",
      optional: true,
    },
    productType: {
      type: "string",
      label: "Product Type",
      description: "A categorization for the product used for filtering and searching products",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the product. `active`: The product is ready to sell and is available to customers on the online store, sales channels, and apps. By default, existing products are set to active. `archived`: The product is no longer being sold and isn't available to customers on sales channels and apps. `draft`: The product isn't ready to sell and is unavailable to customers on sales channels and apps. By default, duplicated and unarchived products are set to draft",
      optional: true,
      options: [
        "ACTIVE",
        "ARCHIVED",
        "DRAFT",
      ],
    },
    images: {
      type: "string[]",
      label: "Images",
      description: "A list of URLs of images to associate with the new product",
      optional: true,
    },
    options: {
      type: "string[]",
      label: "Options",
      description: "The custom product properties. For example, Size, Color, and Material. Each product can have up to 3 options and each option value can be up to 255 characters. Product variants are made of up combinations of option values. Options cannot be created without values. To create new options, a variant with an associated option value also needs to be created. Example: `[{\"name\":\"Color\",\"values\":[{\"name\": \"Blue\"},{\"name\": \"Black\"}]},{\"name\":\"Size\",\"values\":[{\"name\": \"155\"},{\"name\": \"159\"}]}]`",
      optional: true,
    },
    tags: {
      propDefinition: [
        shopify,
        "tags",
      ],
      optional: true,
    },
    metafields: {
      propDefinition: [
        shopify,
        "metafields",
      ],
    },
    handle: {
      type: "string",
      label: "Handle",
      description: "A unique human-friendly string for the product that serves as the URL handle. Automatically generated from the product's title.",
      optional: true,
    },
    seoTitle: {
      type: "string",
      label: "SEO Title",
      description: "The product title used for search engine optimization",
      optional: true,
    },
    seoDescription: {
      type: "string",
      label: "SEO Description",
      description: "The product description used for search engine optimization",
      optional: true,
    },
  },
  async run({ $ }) {
    const metafields = await this.createMetafieldsArray(this.metafields, this.productId, "product");

    const response = await this.shopify.updateProduct({
      input: {
        id: this.productId,
        title: this.title,
        descriptionHtml: this.productDescription,
        vendor: this.vendor,
        productType: this.productType,
        status: this.status,
        images: utils.parseJson(this.images),
        options: utils.parseJson(this.options),
        tags: this.tags,
        metafields,
        metafields_global_title_tag: this.seoTitle,
        metafields_global_description_tag: this.seoDescription,
        handle: this.handle,
      },
    });
    if (response.productUpdate.userErrors.length > 0) {
      throw new Error(response.productUpdate.userErrors[0].message);
    }
    $.export("$summary", `Updated product \`${response.productUpdate.product.title}\` with id \`${response.productUpdate.product.id}\``);
    return response;
  },
};
