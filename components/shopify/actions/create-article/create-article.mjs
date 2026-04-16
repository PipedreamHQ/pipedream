import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-create-article",
  name: "Create Article",
  description: "Create a new blog article. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/articleCreate)",
  version: "0.0.10",
  annotations: {
    destructiveHint: false,
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
    title: {
      type: "string",
      label: "Title",
      description: "The title of the article",
    },
    author: {
      type: "string",
      label: "Author",
      description: "The name of the author of the article",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The text content of the article, complete with HTML markup",
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
    const response = await this.shopify.createArticle({
      article: {
        blogId: this.blogId,
        title: this.title,
        author: {
          name: this.author,
        },
        body: this.body,
        summary: this.summary,
        image: this.image && {
          url: this.image,
        },
        tags: this.tags,
      },
    });
    if (response.articleCreate.userErrors.length > 0) {
      throw new Error(response.articleCreate.userErrors[0].message);
    }
    $.export("$summary", `Created new article with ID ${response.articleCreate.article.id}`);
    return response;
  },
};
