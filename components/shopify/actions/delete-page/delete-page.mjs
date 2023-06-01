import app from "../../common/rest-admin.mjs";

export default {
  key: "shopify-delete-page",
  name: "Delete Page",
  description: "Delete an existing page. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/page#delete-pages-page-id)",
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
  },
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
