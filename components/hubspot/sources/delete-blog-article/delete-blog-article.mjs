import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-delete-blog-article",
  name: "Deleted Blog Posts",
  description: "Emit new event for each deleted blog post.",
  version: "0.0.5",
  dedupe: "unique",
  type: "source",
  hooks: {
    async activate() {
      this._setAfter(Date.now());
    },
  },
  methods: {
    ...common.methods,
    generateMeta(blogpost) {
      const {
        id,
        name: summary,
        deletedAt,
      } = blogpost;
      const ts = Date.parse(blogpost.created);
      return {
        id: id + deletedAt,
        summary,
        ts,
      };
    },
    getParams(after) {
      return {
        limit: 100,
        deletedAt__gte: after,
        sort: "-updatedAt",
      };
    },
    async processResults(after, params) {
      await this.paginate(
        params,
        this.hubspot.getBlogPosts.bind(this),
        "results",
        after,
      );
    },
  },
};
