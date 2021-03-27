const common = require("../common.js");

module.exports = {
  ...common,
  key: "hubspot-new-blog-article",
  name: "New Blog Posts",
  description: "Emits an event for each new blog post.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(blogpost) {
      const { id, name: summary, created } = blogpost;
      const ts = Date.parse(blogpost.created);
      return {
        id,
        summary,
        ts,
      };
    },
    emitEvent(blogpost) {
      const meta = this.generateMeta(blogpost);
      this.$emit(blogpost, meta);
    },
    isRelevant(blogpost, after) {
      return true;
    },
  },
  async run(event) {
    const createdAfter =
      this.db.get("createdAfter") || Date.parse(this.hubspot.monthAgo());
    const params = {
      limit: 100,
      createdAfter, // return entries created since event last ran
    };

    await this.paginate(
      params,
      this.hubspot.getBlogPosts.bind(this),
      "results"
    );

    this.db.set("createdAfter", Date.now());
  },
};