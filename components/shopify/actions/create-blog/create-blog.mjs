import app from "../../common/rest-admin.mjs";

export default {
  key: "shopify-create-blog",
  name: "Create Blog",
  description: "Create a new blog. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/blog#post-blogs)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    title: {
      description: "The title of the blog.",
      propDefinition: [
        app,
        "title",
      ],
    },
  },
  methods: {
    createBlog(args = {}) {
      return this.app.post({
        path: "/blogs",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const { title } = this;

    const response = await this.createBlog({
      step,
      data: {
        blog: {
          title,
        },
      },
    });

    step.export("$summary", `Created new page with ID ${response.blog.id}`);

    return response;
  },
};
