import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bluesky-new-posts-by-author",
  name: "New Posts By Author",
  description: "Emit new event when an author creates a post. Requires the author id as a prop to track posts from a specific author. [See the documentation](https://docs.bsky.app/docs/api/app-bsky-feed-search-posts).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    authorId: {
      propDefinition: [
        common.props.app,
        "authorId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getDateField() {
      return "post.record.createdAt";
    },
    getResourceName() {
      return "feed";
    },
    getResourcesFn() {
      return this.app.getAuthorFeed;
    },
    getResourcesFnArgs() {
      return {
        debug: true,
        params: {
          actor: this.authorId,
        },
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
