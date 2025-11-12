import common from "../common/polling.mjs";

export default {
  ...common,
  key: "dotsimple-new-post-created",
  name: "New Post Created",
  description: "Emit new event when a new post is created on the platform. [See the documentation](https://help.dotsimple.io/en/articles/68-posts).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listPosts;
    },
    generateMeta(resource) {
      return {
        id: resource.uuid,
        summary: `New Post: ${resource.uuid}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
