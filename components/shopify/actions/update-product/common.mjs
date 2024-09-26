export default {
  props: {
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
      handle: this.handle,
    };

    const response = (await this.shopify.updateProduct(this.productId, product)).result;
    $.export("$summary", `Updated product \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
