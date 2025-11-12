import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "deputy-new-post-created",
  name: "New Post Created (Instant)",
  description: "Emit new event when a new newsfeed post arrives",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "Memo.Insert";
    },
    generateMeta(post) {
      return {
        id: post.Id,
        summary: `New Post: ${post.Id}`,
        ts: Date.parse(post.Created),
      };
    },
  },
  sampleEmit,
};
