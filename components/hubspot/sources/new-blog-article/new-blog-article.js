const hubspot = require("../../hubspot.app.js");

module.exports = {
  key: "hubspot-new-blog-article",
  name: "New Blog Posts",
  description: "Emits an event for each new blog post.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    hubspot,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run(event) {
    const lastRun = this.db.get("createdAfter") || this.hubspot.monthAgo();
    const createdAfter = new Date(lastRun);

    const results = await this.hubspot.getBlogPosts(createdAfter.getTimee());
    for (const blogpost of results) {
      let createdAt = new Date(blogpost.created);
      this.$emit(blogpost, {
        id: blogpost.id,
        summary: blogpost.name,
        ts: createdAt.getTime(),
      });
    }

    this.db.set("createdAfter", Date.now());
  },
};