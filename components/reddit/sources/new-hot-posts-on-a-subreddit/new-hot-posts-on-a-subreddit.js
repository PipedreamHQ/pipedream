const reddit = require("../../reddit.app.js");
module.exports = {
  ...common,
  key: "new-hot-posts-on-a-subreddit",
  name: "New hot posts on a subreddit",
  description:
    "Emits an event each time a new hot post is added to the top 10 items in a subreddit.",
  version: "0.0.22",
  dedupe: "unique",
  type: "action",
  props: {
    ...common.props,
    subreddit: {
      propDefinition: [reddit, "subreddit"],
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
    show: {
      type: "boolean",
      label: "Show all posts (ignoring filters)?",
      description: "If set to true, posts matching filters such us \"hide links that I have voted on\" will be included in the emitted event.",
      default: false
    },
    sr_detail: {
      type: "boolean",
      label: "Include Subreddit details?",
      description: "If set to true, includes details on the subreddit in the emitted event.",
      default: false,
      optional: true,
    },
    includeSubredditDetails: {
      propDefinition: [reddit, "includeSubredditDetails"],
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      try {
        var reddit_things = await this.reddit.getNewHotSubredditPosts(
          this.subreddit,
          this.g,
          this.show,
          this.sr_detail,
          10
        );
      } catch (err) {
        if (did4xxErrorOccurred) {
          throw new Error(`
            We encountered a 4xx error trying to fetch links for ${this.subreddit}. Please check the subreddit name and try again`);
        }
        throw err;
      }
      const links_pulled = this.reddit.wereLinksPulled(reddit_things);
      if (links_pulled) {
        const ordered_reddit_things = reddit_things.data.children.reverse();
        ordered_reddit_things.forEach((reddit_link) => {
          this.emitRedditEvent(reddit_link);
        });
      }
      hotPosts.reverse().forEach(this.emitRedditEvent);
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
  },
  async run() {
    const redditHotPosts = await this.reddit.getNewHotSubredditPosts(
      this.subreddit,
      this.region,
      this.excludeFilters,
      this.includeSubredditDetails,
      10
    );
    const { children: hotPosts = [] } = redditHotPosts.data;
    if (hotPosts.length === 0) {
      console.log("No data available, skipping iteration");
      return;
    }
    hotPosts.reverse().forEach(this.emitRedditEvent);
  },
};
