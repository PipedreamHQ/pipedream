export default {
  methods: {
    deleteBlog({
      blogId, ...args
    } = {}) {
      return this.app.delete({
        path: `/blogs/${blogId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const { blogId } = this;

    await this.deleteBlog({
      step,
      blogId,
    });

    step.export("$summary", `Deleted blog with ID ${blogId}`);

    return {
      success: true,
    };
  },
};
