import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "adhook-updated-post",
  name: "New Updated Post",
  description: "Emit new event when a post is updated.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.adhook.listUpdatedPosts;
    },
    getFieldDate() {
      return "updatedAt";
    },
    getSummary(post) {
      return  `Post Updated: ${post.id}`;
    },
  },
  sampleEmit,
};
