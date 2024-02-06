export default {
  methods: {
    deletePage({
      pageId, ...args
    } = {}) {
      return this.app.delete({
        path: `/pages/${pageId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const { pageId } = this;

    await this.deletePage({
      step,
      pageId,
    });

    step.export("$summary", `Deleted page with ID ${pageId}`);

    return {
      success: true,
    };
  },
};
