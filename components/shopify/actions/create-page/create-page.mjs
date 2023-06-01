import app from "../../common/rest-admin.mjs";

export default {
  key: "shopify-create-page",
  name: "Create Page",
  description: "Create a new page. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/page#post-pages)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    title: {
      description: "The title of the page.",
      propDefinition: [
        app,
        "title",
      ],
    },
    bodyHtml: {
      propDefinition: [
        app,
        "bodyHtml",
      ],
    },
  },
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
