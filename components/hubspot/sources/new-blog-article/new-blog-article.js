const common = require("../common.js");

module.exports = {
  ...common,
  key: "hubspot-new-blog-article",
  name: "New Blog Posts",
  description: "Emits an event for each new blog post.",
  version: "0.0.2",
  dedupe: "unique",
  hooks: {},
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
  },
  async run(event) {
    const createdAfter = this._getAfter();
    const params = {
      limit: 100,
      createdAfter, // return entries created since event last ran
    };

    await this.paginate(
      params,
      this.hubspot.getBlogPosts.bind(this),
      "results"
    );

    this._setAfter(Date.now());
  },
};