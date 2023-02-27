import shopify from "../../shopify.app.mjs";
import common from "../common/metafield-actions.mjs";

export default {
  ...common,
  key: "shopify-update-product",
  name: "Update Product",
  description: "Update an existing product. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/product#[put]/admin/api/2022-01/products/{product_id}.json)",
  version: "0.0.9",
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
      propDefinition: [
        shopify,
        "title",
      ],
      optional: true,
    },
    productDescription: {
      propDefinition: [
        shopify,
        "productDescription",
      ],
    },
    vendor: {
      propDefinition: [
        shopify,
        "vendor",
      ],
    },
    productType: {
      propDefinition: [
        shopify,
        "productType",
      ],
    },
    status: {
      propDefinition: [
        shopify,
        "status",
      ],
    },
    images: {
      propDefinition: [
        shopify,
        "images",
      ],
    },
    options: {
      propDefinition: [
        shopify,
        "options",
      ],
    },
    variants: {
      propDefinition: [
        shopify,
        "variants",
      ],
    },
    tags: {
      propDefinition: [
        shopify,
        "tags",
      ],
    },
    metafields: {
      propDefinition: [
        shopify,
        "metafields",
      ],
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

    const variants = [];
    const variantsArray = this.shopify.parseArrayOfJSONStrings(this.variants);
    for (const variant of variantsArray) {
      if (variant.metafields) {
        const variantMetafields = await this.createMetafieldsArray(variant.metafields, variant.id, "variants");
        variants.push({
          ...variant,
          metafields: variantMetafields,
        });
        continue;
      }
      variants.push(variant);
    }

    const product = {
      title: this.title,
      body_html: this.productDescription,
      vendor: this.vendor,
      product_type: this.productType,
      status: this.status,
      images: this.shopify.parseImages(this.images),
      options: this.shopify.parseArrayOfJSONStrings(this.options),
      variants,
      tags: this.shopify.parseCommaSeparatedStrings(this.tags),
      metafields,
      metafields_global_title_tag: this.seoTitle,
      metafields_global_description_tag: this.seoDescription,
    };

    const response = (await this.shopify.updateProduct(this.productId, product)).result;
    $.export("$summary", `Updated product \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
