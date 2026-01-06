import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "announcekit-new-post",
  name: "New Post",
  description: "Emit new event when a new post is created. [See the documentation](https://announcekit.app/docs/graphql-api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getSummary(post) {
      return `New Post with ID: ${post.id}`;
    },
    getFn() {
      return this.app.listPosts;
    },
    getItemsField() {
      return "posts";
    },
  },
  sampleEmit,
};

