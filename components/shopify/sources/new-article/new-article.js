const shopify = require("../../shopify.app.js");

module.exports = {
  key: "shopify-new-article",
  name: "New Article",
  description: "Emits an event for each new article in a blog.",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    shopify,
    blogIds: {
      type: "string[]",
      label: "Blogs",
      async options() {
        const blogs = await this.shopify.getBlogs();
        return blogs.map((blog) => {
          return { label: blog.title, value: blog.id };
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
