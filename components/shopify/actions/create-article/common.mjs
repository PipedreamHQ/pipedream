export default {
  methods: {
    createArticle({
      blogId, ...args
    } = {}) {
      return this.app.post({
        path: `/blogs/${blogId}/articles`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      blogId,
      title,
      bodyHtml,
    } = this;

    const response = await this.createArticle({
      step,
      blogId,
      data: {
        article: {
          title,
          body_html: bodyHtml,
        },
      },
    });

    step.export("$summary", `Created new page with ID ${response.article.id}`);

    return response;
  },
};
