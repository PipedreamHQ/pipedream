export default {
  async run({ $ }) {
    let data = {
      title: this.title,
      body_html: this.productDescription,
      vendor: this.vendor,
      product_type: this.productType,
      status: this.status,
      images: this.shopify.parseImages(this.images),
      variants: this.shopify.parseArrayOfJSONStrings(this.variants),
      options: this.shopify.parseArrayOfJSONStrings(this.options),
      tags: this.shopify.parseCommaSeparatedStrings(this.tags),
    };

    let response = (await this.shopify.createProduct(data)).result;
    $.export("$summary", `Created new product \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
