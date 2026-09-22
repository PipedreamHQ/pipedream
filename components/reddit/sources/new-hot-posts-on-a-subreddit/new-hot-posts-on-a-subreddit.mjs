import get from "lodash/get.js";
import common from "../common.mjs";
import regionData from "./region-data.mjs";
import sampleEmit from "./test-event.mjs";
const { reddit } = common.props;

export default {
  ...common,
  type: "source",
  key: "reddit-new-hot-posts-on-a-subreddit",
  name: "New hot posts on a subreddit",
  description:
    "Emit new event each time a new hot post is added to the top 10 items in a subreddit.",
  version: "0.2.4",
  dedupe: "unique",
  props: {
    ...common.props,
    subreddit: {
      propDefinition: [
        reddit,
        "subreddit",
      ],
    },
    region: {
      type: "string",
      label: "Region",
      description:
        "Hot posts differ by region, and this refers to the region you'd like to watch for hot posts.",
      options: regionData,
      default: "GLOBAL",
      optional: true,
    },
    excludeFilters: {
      type: "boolean",
      label: "Exclude filters (Show all posts)?",
      description:
        "If set to `true`, filters such as \"hide links that I have voted on\" will be disabled",
      default: false,
      optional: true,
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
      await this.fetchData();
    },
  },
  methods: {
    ...common.methods,
    generateEventMetadata(redditEvent) {
      return {
        id: redditEvent.data.name,
        summary: redditEvent.data.title,
        ts: redditEvent.data.created,
      };
    },
    async fetchData() {
      // Emits sample events on the first run during deploy.
      var redditHotPosts = await this.reddit.getNewHotSubredditPosts(
        get(this.subreddit, "value", this.subreddit),
        this.region,
        this.excludeFilters,
        this.includeSubredditDetails,
        10,
      );
      const { children: hotPosts = [] } = redditHotPosts.data;
      if (hotPosts.length === 0) {
        console.log("No data available, skipping iteration");
        return;
      }
      hotPosts.reverse().forEach(this.emitRedditEvent);
    },
  },
  async run() {
    await this.fetchData();
  },
  sampleEmit,
};
