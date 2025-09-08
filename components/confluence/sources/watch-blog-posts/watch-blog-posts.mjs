import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "confluence-watch-blog-posts",
  name: "Watch Blog Posts",
  description: "Emit new event when a blog post is created or updated",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.confluence.listPosts;
    },
    async getArgs() {
      return {
        cloudId: await this.confluence.getCloudId(),
        params: {
          sort: "-modified-date",
        },
      };
    },
    getTs(post) {
      return Date.parse(post.version.createdAt);
    },
    getSummary(post) {
      return `New or updated blogpost with ID ${post.id}`;
    },
  },
  sampleEmit,
};
