import app from "../../common/rest-admin.mjs";

export default {
  key: "shopify-update-page",
  name: "Update Page",
  description: "Update an existing page. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/page#put-pages-page-id)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    pageId: {
      propDefinition: [
        app,
        "pageId",
      ],
    },
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
