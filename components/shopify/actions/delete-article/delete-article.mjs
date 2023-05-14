import app from "../../common/rest-admin.mjs";

export default {
  key: "shopify-delete-article",
  name: "Delete Article",
  description: "Delete an existing blog article. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/article#delete-blogs-blog-id-articles-article-id)",
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
  },
  methods: {
    deleteBlogArticle({
      blogId, articleId, ...args
    } = {}) {
      return this.app.delete({
        path: `/blogs/${blogId}/articles/${articleId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      blogId,
      articleId,
    } = this;

    await this.deleteBlogArticle({
      step,
      blogId,
      articleId,
    });

    step.export("$summary", `Deleted article with ID ${articleId} from blog with ID ${blogId}.`);

    return {
      success: true,
    };
  },
};
