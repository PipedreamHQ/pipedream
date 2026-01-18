import shopify from "../../shopify.app.mjs";
import common from "../common/metafield-actions.mjs";

export default {
  ...common,
  key: "shopify-update-product",
  name: "Update Product",
  description: "Update an existing product. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/productUpdate)",
  version: "0.1.8",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      description: "The new title of the product",
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
        tags: this.tags,
        metafields,
        seo: this.seoTitle || this.seoDescription
          ? {
            title: this.seoTitle,
            description: this.seoDescription,
          }
          : undefined,
        handle: this.handle,
      },
      media: this.images && this.images.map((image) => ({
        mediaContentType: "IMAGE",
        originalSource: image,
      })),
    });
    if (response.productUpdate.userErrors.length > 0) {
      throw new Error(response.productUpdate.userErrors[0].message);
    }
    $.export("$summary", `Updated product \`${response.productUpdate.product.title}\` with id \`${this.productId}\``);
    return response;
  },
};
