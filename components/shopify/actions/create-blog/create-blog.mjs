import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-create-blog",
  name: "Create Blog",
  description: "Create a new blog. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/blogCreate)",
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
      description: "The title of the blog.",
    },
  },
  async run({ $ }) {
    const response = await this.shopify.createBlog({
      blog: {
        title: this.title,
      },
    });
    if (response.blogCreate.userErrors.length > 0) {
      throw new Error(response.blogCreate.userErrors[0].message);
    }
    $.export("$summary", `Created new blog with ID ${response.blogCreate.blog.id}`);
    return response;
  },
};
