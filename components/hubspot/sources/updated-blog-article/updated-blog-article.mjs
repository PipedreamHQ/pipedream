import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-update-blog-article",
  name: "Updated Blog Posts",
  description: "Emit new event for each updated blog post.",
  version: "0.0.2",
  dedupe: "unique",
  type: "source",
  hooks: {
    hooks: {
      async activate() {
        this._setAfter(Date.now());
      },
    },
  },
  methods: {
    ...common.methods,
    generateMeta(blogpost) {
      const {
        id,
        name: summary,
        updated,
        created,
      } = blogpost;
      if (created != updated) {
        const ts = Date.parse(blogpost.created);
        return {
          id: id + updated,
          summary,
          ts,
        };
      }
    },
    getParams(after) {
      return {
        limit: 100,
        updated__gte: after,
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
