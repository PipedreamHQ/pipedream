import app from "../../common/rest-admin.mjs";

export default {
  key: "shopify-create-article",
  name: "Create Article",
  description: "Create a new blog article. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/article#post-blogs-blog-id-articles)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    blogId: {
      propDefinition: [
        app,
        "blogId",
      ],
    },
    title: {
      description: "The title of the article.",
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

    step.export("$summary", `Created new page with ID ${response.page.id}`);

    return response;
  },
};
