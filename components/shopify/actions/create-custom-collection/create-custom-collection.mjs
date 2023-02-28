import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-create-custom-collection",
  name: "Create Custom Collection",
  description: "Create a new custom collection. [See the docs](https://shopify.dev/docs/api/admin-rest/2023-01/resources/customcollection#post-custom-collections)",
  version: "0.0.1",
  type: "action",
  props: {
    shopify,
    title: {
      propDefinition: [
        shopify,
        "title",
      ],
      description: "The name of the custom collection",
    },
    products: {
      propDefinition: [
        shopify,
        "productId",
      ],
      type: "string[]",
      optional: true,
    },
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
    metafields: {
      propDefinition: [
        shopify,
        "metafields",
      ],
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
