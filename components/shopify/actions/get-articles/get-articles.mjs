import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-get-articles",
  name: "Get Articles",
  description: "Retrieve a list of all articles from a blog. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/articles)",
  version: "0.0.10",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    maxResults: {
      propDefinition: [
        shopify,
        "maxResults",
      ],
    },
    reverse: {
      propDefinition: [
        shopify,
        "reverse",
      ],
    },
  },
  async run({ $ }) {
    const articles = await this.shopify.getPaginated({
      resourceFn: this.shopify.listBlogArticles,
      resourceKeys: [
        "blog",
        "articles",
      ],
      variables: {
        id: this.blogId,
        reverse: this.reverse,
      },
      max: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${articles.length} article${articles.length === 1
      ? ""
      : "s"}`);
    return articles;
  },
};
