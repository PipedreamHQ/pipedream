export default {
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
