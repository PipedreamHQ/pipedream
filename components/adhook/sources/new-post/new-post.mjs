import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "adhook-new-post",
  name: "New Post Created",
  description: "Emit new event when a new post is created. [See the documentation](https://app.adhook.io/api-doc/)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.adhook.listCreatedPosts;
    },
    getFieldDate() {
      return "createdAt";
    },
    getSummary(item) {
      return `New Post: ${item.id}`;
    },
  },
  sampleEmit,
};
