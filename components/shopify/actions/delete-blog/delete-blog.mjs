import app from "../../common/rest-admin.mjs";

export default {
  key: "shopify-delete-blog",
  name: "Delete Blog",
  description: "Delete an existing blog. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/blog#delete-blogs-blog-id)",
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
  },
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
