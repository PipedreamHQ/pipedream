const reddit = require("../../reddit.app.js");
//https://www.reddit.com/dev/api#GET_hot
module.exports = {
  ...common,
  key: "new-hot-posts-on-a-subreddit",
  name: "New hot posts on a subreddit",
  description:
    "Emits an event each time a new hot post is added to the top 10 items in a subreddit.",
  version: "0.0.21",
  type: "action",
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
      optional: false,
    },
    show: {
      type: "boolean",
      label: "Show all posts (ignoring filters)?",
      description:
        'If set to true, posts matching filters such us "hide links that I have voted on" will be included in the emitted event.',
      default: false,
      optional: true,
    },
    sr_detail: {
      type: "boolean",
      label: "Include Subreddit details?",
      description:
        "If set to true, includes details on the subreddit in the emitted event.",
      default: false,
      optional: true,
    },
    timer: {
      label: "Polling schedule",
      description: "Pipedream polls Reddit for new hot posts on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 20, // by default, run every 10 minute.
      },
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      try {
        var hot_posts = await this.reddit.getNewHotSubredditPosts(
          this.subreddit,
          this.g,
          this.show,
          this.sr_detail,
          10
        );
      } catch (err) {
        if (this.reddit.did4xxErrorOccurred(err)) {
          throw new Error(`
            We encountered a 4xx error trying to fetch hot posts for ${this.subreddit}. Please check the subreddit name and try again.`);
        }
        throw err;
      }
      const hot_posts_pulled = this.reddit.wereThingsPulled(hot_posts);
      if (hot_posts_pulled) {
        const ordered_hot_posts = hot_posts.data.children.reverse();
        ordered_hot_posts.forEach((hot_post) => {
          this.emitRedditEvent(hot_post);
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
    const hot_posts = await this.reddit.getNewHotSubredditPosts(
      this.subreddit,
      this.region,
      this.excludeFilters,
      this.includeSubredditDetails,
      10
    );
    const hot_posts_pulled = this.reddit.wereThingsPulled(hot_posts);
    if (hot_posts_pulled) {
      const ordered_hot_posts = hot_posts.data.children.reverse();
      ordered_hot_posts.forEach((hot_post) => {
        this.emitRedditEvent(hot_post);
      });
    }
    hotPosts.reverse().forEach(this.emitRedditEvent);
  },
};
