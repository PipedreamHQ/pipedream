import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-delete-blog-article",
  name: "Deleted Blog Posts",
  description: "Emit new event for each deleted blog post.",
  version: "0.0.10",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    getTs(blogpost) {
      return Date.parse(blogpost.deletedAt);
    },
    generateMeta(blogpost) {
      const {
        id,
        name: summary,
      } = blogpost;
      const ts = Date.parse(blogpost.created);
      return {
        id: `${id}${this.getTs(blogpost)}`,
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
