import app from "../../common/rest-admin.mjs";

export default {
  key: "shopify-update-article",
  name: "Update Article",
  description: "Update a blog article. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/article#put-blogs-blog-id-articles-article-id)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    blogId: {
      propDefinition: [
        app,
        "blogId",
      ],
    },
    articleId: {
      propDefinition: [
        app,
        "articleId",
        ({ blogId }) => ({
          blogId,
        }),
      ],
    },
    title: {
      description: "The title of the article.",
      propDefinition: [
        app,
        "title",
      ],
    },
    bodyHtml: {
      description: "The text content of the article, complete with HTML markup.",
      propDefinition: [
        app,
        "bodyHtml",
      ],
    },
  },
  methods: {
    updateBlogArticle({
      blogId, articleId, ...args
    } = {}) {
      return this.app.put({
        path: `/blogs/${blogId}/articles/${articleId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      blogId,
      articleId,
      title,
      bodyHtml,
    } = this;

    const response = await this.updateBlogArticle({
      step,
      blogId,
      articleId,
      data: {
        article: {
          title,
          body_html: bodyHtml,
        },
      },
    });

    step.export("$summary", `Updated article with ID ${response.article.id}.`);

    return response;
  },
};
