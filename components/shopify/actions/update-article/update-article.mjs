import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-update-article",
  name: "Update Article",
  description: "Update a blog article. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/articleUpdate)",
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
        ({ blogId }) => ({
          blogId,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the article",
      optional: true,
    },
    bodyHtml: {
      type: "string",
      label: "Body",
      description: "The text content of the article, complete with HTML markup.",
      optional: true,
    },
    author: {
      type: "string",
      label: "Author",
      description: "The name of the author of the article",
      optional: true,
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "A summary of the article, which can include HTML markup. The summary is used by the online store theme to display the article on other pages, such as the home page or the main blog page.",
      optional: true,
    },
    image: {
      type: "string",
      label: "Image",
      description: "The URL of the image associated with the article",
      optional: true,
    },
    tags: {
      propDefinition: [
        shopify,
        "tags",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.shopify.updateArticle({
      id: this.articleId,
      article: {
        title: this.title,
        body: this.bodyHtml,
        author: this.author && {
          name: this.author,
        },
        summary: this.summary,
        image: this.image && {
          url: this.image,
        },
        tags: this.tags,
      },
    });
    if (response.articleUpdate.userErrors.length > 0) {
      throw new Error(response.articleUpdate.userErrors[0].message);
    }
    $.export("$summary", `Updated article with ID ${response.articleUpdate.article.id}.`);

    return response;
  },
};
