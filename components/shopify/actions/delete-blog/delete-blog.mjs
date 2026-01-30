import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-delete-blog",
  name: "Delete Blog",
  description: "Delete an existing blog. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/blogDelete)",
  version: "0.0.10",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shopify,
    blogId: {
      propDefinition: [
        shopify,
        "blogId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.shopify.deleteBlog({
      id: this.blogId,
    });
    $.export("$summary", `Deleted blog with ID ${this.blogId}`);
    return response;
  },
};
