export default {
  methods: {
    updatePage({
      pageId, ...args
    } = {}) {
      return this.app.put({
        path: `/pages/${pageId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      pageId,
      title,
      bodyHtml,
    } = this;

    const response = await this.updatePage({
      step,
      pageId,
      data: {
        page: {
          title,
          body_html: bodyHtml,
        },
      },
    });

    step.export("$summary", `Updated page with ID ${response.page.id}`);

    return response;
  },
};
