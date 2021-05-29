const common = require("../../common");
const { reddit } = common.props;

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
    sr_detail: { propDefinition: [reddit, "sr_detail"] },
    ...common.props,
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
        if (common.methods.did4xxErrorOccur(err)) {
          throw new Error(`
            We encountered a 4xx error trying to fetch hot posts for ${this.subreddit}. Please check the subreddit name and try again.`);
        }
        throw err;
      }
      const hot_posts_pulled = common.methods.wereThingsPulled(hot_posts);
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
    generateEventMetadata(reddit_event) {
      return {
        id: reddit_event.data.name,
        summary: reddit_event.data.title,
        ts: reddit_event.data.created,
      };
    },
    emitRedditEvent(reddit_event) {
      const emitRedditEventHandler = common.methods.emitRedditEvent.bind(this);
      emitRedditEventHandler(reddit_event);
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
    const hot_posts_pulled = common.methods.wereThingsPulled(hot_posts);
    if (hot_posts_pulled) {
      const ordered_hot_posts = hot_posts.data.children.reverse();
      ordered_hot_posts.forEach((hot_post) => {
        this.emitRedditEvent(hot_post);
      });
    }
    hotPosts.reverse().forEach(this.emitRedditEvent);
  },
};
