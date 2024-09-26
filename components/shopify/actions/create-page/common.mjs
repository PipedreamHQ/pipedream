export default {
  methods: {
    createPage(args = {}) {
      return this.app.post({
        path: "/pages",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      title,
      bodyHtml,
    } = this;

    const response = await this.createPage({
      step,
      data: {
        page: {
          title,
          body_html: bodyHtml,
        },
      },
    });

    step.export("$summary", `Created new page with ID ${response.page.id}`);

    return response;
  },
};
