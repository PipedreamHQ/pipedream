import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bluesky-new-timeline-posts",
  name: "New Timeline Posts",
  description: "Emit new event when posts appear in the `following` feed. [See the documentation](https://docs.bsky.app/docs/api/app-bsky-feed-get-timeline).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDateField() {
      return "post.record.createdAt";
    },
    getResourceName() {
      return "feed";
    },
    getResourcesFn() {
      return this.app.getTimeline;
    },
    getResourcesFnArgs() {
      return {
        debug: true,
      };
    },
    generateMeta(resource) {
      const { post } = resource;
      return {
        id: post.cid,
        summary: `New Post at ${post.record.createdAt}`,
        ts: Date.parse(post.record.createdAt),
      };
    },
  },
  sampleEmit,
};
