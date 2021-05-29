const common = require("../common");
const localeData = require("./locale-data");
const { reddit } = common.props;

module.exports = {
  ...common,
  key: "new-hot-posts-on-a-subreddit",
  name: "New hot posts on a subreddit",
  description:
    "Emits an event each time a new hot post is added to the top 10 items in a subreddit.",
  version: "0.0.1",
  dedupe: "unique",
  type: "action",
  props: {
    ...common.props,
    subreddit: {
      propDefinition: [common.props.reddit, "subreddit"],
    },
    locale: {
      type: "string",
      label: "Region",
      description:
        "Hot posts differ by region, and this refers to the locale you'd like to watch for hot posts.",
      options: localeData,
      default: "GLOBAL",
      optional: false,
    },
    showAllPosts: {
      type: "boolean",
      label: "Show all posts (ignoring filters)?",
      description:
        'If set to true, posts matching filters such us "hide links that I have voted on" will be included in the emitted event.',
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
      var hotPosts = await this.reddit.getNewHotSubredditPosts(
        this.subreddit,
        this.locale,
        this.showAllPosts,
        this.includeSubredditDetails,
        10
      );
      if (!hotPosts) {
        console.log("No data available, skipping emitting sample events");
        return;
      }
      const orderedHotPosts = hotPosts.reverse();
      orderedHotPosts.forEach((hotPost) => {
        this.emitRedditEvent(hotPost);
      });
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
    console.log("testing out the 500 error");
    const hotPosts = await this.reddit.getNewHotSubredditPosts(
      this.subreddit,
      this.locale,
      this.showAllPosts,
      this.includeSubredditDetails,
      10
    );
    if (!hotPosts) {
      console.log("No data available, skipping itieration");
    } else {
      const orderedHotPosts = hotPosts.reverse();
      orderedHotPosts.forEach((hotPost) => {
        this.emitRedditEvent(hotPost);
      });
    }
    hotPosts.reverse().forEach(this.emitRedditEvent);
  },
};
