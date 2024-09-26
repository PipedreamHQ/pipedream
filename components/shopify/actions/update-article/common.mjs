export default {
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
