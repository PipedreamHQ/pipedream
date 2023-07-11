export default {
  props: {
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "The source URL that specifies the location of the image",
      optional: true,
    },
    published: {
      type: "boolean",
      label: "Published",
      description: "Whether the custom collection is published to the Online Store channel",
      optional: true,
    },
  },
  async run({ $ }) {
    const collects = this.products?.map((product) => ({
      product_id: product,
    })) || [];

    const data = {
      title: this.title,
      collects,
      image: {
        src: this.imageUrl,
      },
      published: this.published,
      metafields: this.shopify.parseArrayOfJSONStrings(this.metafields),
    };

    const { result } = await this.shopify.createCustomCollection(data);
    $.export("$summary", `Created new custom collection \`${result.title}\` with ID \`${result.id}\``);
    return result;
  },
};
