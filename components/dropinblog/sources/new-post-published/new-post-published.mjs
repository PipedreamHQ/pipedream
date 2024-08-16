import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dropinblog-new-post-published",
  name: "New Post Published",
  description: "Emit new event when a new post is published. [See the documentation](https://dropinblog.readme.io/reference/posts-list).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDateField() {
      return "publishedAt";
    },
    getResourceName() {
      return "data.posts";
    },
    getResourcesFn() {
      return this.app.listPosts;
    },
    getResourcesFnArgs() {
      return {
        debug: true,
        params: {
          statuses: "published",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: resource.title,
        ts: Date.parse(resource[this.getDateField()]),
      };
    },
  },
  sampleEmit,
};
