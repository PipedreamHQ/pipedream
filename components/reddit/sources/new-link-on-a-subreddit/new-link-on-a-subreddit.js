const reddit = require("../../reddit.app.js");

module.exports = {
  key: "new-link-on-a-subreddit",
  name: "New Link on a subreddit",
  description: "Emits an event each time a new link is added to a subreddit",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    reddit,
    subreddit: {
      type: "string",
      label: "Subreddit",
      description: "The subreddit you'd like to watch for new links.",
      default: "redditdev",
    },
    timer: {
      label: "Polling schedule",
      description: "Pipedream polls Reddit for new links on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 10, // by default, run every 10 minutes.
      },
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Emits 10 sample events on the first run during deploy.
      let before = null;

      const reddit_things = await this.reddit.getNewSubredditLinks(
        null,
        this.subreddit,
        10
      );

      const links_pulled = this.reddit.wereLinksPulled(reddit_things);
      if (links_pulled) {
        before = reddit_things.data.children[0].data.name;
        reddit_things.data.children.forEach((reddit_link) => {
          this.emitRedditEvent(reddit_link);
        });
      }

      this.db.set("before", before);
    },
  },
  methods: {
    emitRedditEvent(reddit_event) {
      const { name: id, title: summary } = reddit_event.data;
      this.$emit(reddit_event, {
        id,
        summary,
      });
    },
  },
  async run() {
    const start_before = this.db.get("before");
    do {
      const reddit_things = await this.reddit.getNewSubredditLinks(
        start_before,
        this.subreddit
      );

      var links_pulled = this.reddit.wereLinksPulled(reddit_things);
      if (links_pulled) {
        const new_before = reddit_things.data.children[0].data.name;
        this.db.set("before", new_before);
        reddit_things.data.children.forEach((reddit_link) => {
          this.emitRedditEvent(reddit_link);
        });
      }
    } while (links_pulled);
  },
};
