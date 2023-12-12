export default {
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
