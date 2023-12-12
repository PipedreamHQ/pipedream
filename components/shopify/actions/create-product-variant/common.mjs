export default {
  async run({ $ }) {
    const productVariant = {
      option1: this.option,
      price: this.price,
      image_id: this.imageId,
      sku: this.sku,
    };
    const response = (await this.shopify.createProductVariant(
      this.productId,
      productVariant,
    )).result;
    $.export("$summary", `Created new product variant \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
