import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-blog-article",
  name: "New Blog Posts",
  description: "Emit new event for each new blog post.",
  version: "0.0.16",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    getTs(blogpost) {
      return Date.parse(blogpost.created);
    },
    generateMeta(blogpost) {
      const {
        id,
        name: summary,
      } = blogpost;
      const ts = this.getTs(blogpost);
      return {
        id,
        summary,
        ts,
      };
    },
    getParams(after) {
      return {
        limit: 100,
        createdAfter: after, // return entries created since event last ran
      };
    },
    async processResults(after, params) {
      await this.paginate(
        params,
        this.hubspot.getBlogPosts.bind(this),
        "results",
      );
    },
  },
};
