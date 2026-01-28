import shopify from "../../shopify.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shopify-create-custom-collection",
  name: "Create Custom Collection",
  description: "Create a new custom collection. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/collectionCreate)",
  version: "0.0.10",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shopify,
    title: {
      type: "string",
      label: "Title",
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
    metafields: {
      propDefinition: [
        shopify,
        "metafields",
      ],
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "The source URL that specifies the location of the image",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.shopify.createCollection({
      input: {
        title: this.title,
        products: this.products,
        metafields: this.metafields && utils.parseJson(this.metafields),
        image: this.imageUrl && {
          src: this.imageUrl,
        },
      },
    });
    if (response.collectionCreate.userErrors.length > 0) {
      throw new Error(response.collectionCreate.userErrors[0].message);
    }
    $.export("$summary", `Created new custom collection \`${this.title}\` with ID \`${response.collectionCreate.collection.id}\``);
    return response;
  },
};
