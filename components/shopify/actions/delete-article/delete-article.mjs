import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-delete-article",
  name: "Delete Article",
  description: "Delete an existing blog article. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/articleDelete)",
  version: "0.0.8",
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
    articleId: {
      propDefinition: [
        shopify,
        "articleId",
        (c) => ({
          blogId: c.blogId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.shopify.deleteArticle({
      id: this.articleId,
    });
    $.export("$summary", `Deleted article with ID ${this.articleId} from blog with ID ${this.blogId}`);
    return response;
  },
};
