import get from "lodash/get.js";
import common from "../common.mjs";
const { reddit } = common.props;

export default {
  ...common,
  type: "source",
  key: "reddit-new-comments-on-a-post",
  name: "New comments on a post",
  description:
    "Emit new event each time a new comment is added to a subreddit.",
  version: "0.1.3",
  dedupe: "unique",
  props: {
    ...common.props,
    subreddit: {
      propDefinition: [
        reddit,
        "subreddit",
      ],
    },
    subredditPost: {
      propDefinition: [
        reddit,
        "subredditPost",
        ({ subreddit }) => ({
          subreddit,
        }),
      ],
    },
    numberOfParents: {
      type: "integer",
      label: "numberOfParents",
      description:
        "When set to 0, the emitted events will only contain the new comment. Otherwise, the events will also contain the parents of the new comment up to the number indicated in this property.",
      optional: true,
      min: 0,
      max: 8,
      default: 0,
    },
    depth: {
      propDefinition: [
        reddit,
        "depth",
      ],
      default: 1,
    },
    includeSubredditDetails: {
      propDefinition: [
        reddit,
        "includeSubredditDetails",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.fetchData(10);
    },
  },
  methods: {
    ...common.methods,
    generateEventMetadata(redditEvent) {
      return {
        id: redditEvent.data.name,
        summary: redditEvent.data.body,
        ts: redditEvent.data.created,
      };
    },
    async fetchData(limit) {
      const redditComments = await this.reddit.getNewSubredditComments(
        get(this.subreddit, "value", this.subreddit),
        get(this.subredditPost, "value", this.subredditPost),
        this.numberOfParents,
        this.depth,
        this.includeSubredditDetails,
        limit,
      );
      const { children: comments = [] } = redditComments.data;
      if (comments.length === 0) {
        console.log("No data available, skipping iteration");
        return;
      }
      comments.reverse().forEach(this.emitRedditEvent);
    },
  },
  async run() {
    await this.fetchData();
  },
};
