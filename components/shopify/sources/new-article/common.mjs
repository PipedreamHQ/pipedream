import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    blogIds: {
      type: "string[]",
      label: "Blogs",
      description: "A list of Blog IDs",
      async options() {
        const blogs = await this.shopify.getBlogs();
        return blogs.map((blog) => {
          return {
            label: blog.title,
            value: blog.id,
          };
        });
      },
    },
  },
  async run() {
    for (const blogId of this.blogIds) {
      let sinceId = this.db.get(blogId) || null;
      let results = await this.shopify.getArticles(blogId, sinceId);
      for (const article of results) {
        this.$emit(article, {
          id: article.id,
          summary: article.title,
          ts: Date.now(),
        });
      }
      if (results[results.length - 1])
        this.db.set(blogId, results[results.length - 1].id);
    }
  },
};
