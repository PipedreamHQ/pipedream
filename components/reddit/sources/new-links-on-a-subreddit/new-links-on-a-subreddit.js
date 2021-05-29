const reddit = require("../../reddit.app.js");

module.exports = {
  ...common,
  key: "new-link-on-a-subreddit",
  name: "New Link on a subreddit",
  description: "Emits an event each time a new link is added to a subreddit",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    reddit,
    subreddit: {
      propDefinition: [reddit, "subreddit"],
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
      try {
        var reddit_things = await this.reddit.getNewSubredditLinks(
          null,
          this.subreddit,
          10
        );
      } catch (err) {
        if (did4xxErrorOccurred) {
          throw new Error(
            `We encountered a 4xx error trying to fetch links for ${this.subreddit}. Please check the subreddit name and try again`
          );
        }
        throw err;
      }
      const links_pulled = this.reddit.wereLinksPulled(reddit_things);
      if (links_pulled) {
        before = reddit_things.data.children[0].data.name;
        const ordered_reddit_things = reddit_things.data.children.reverse();
        ordered_reddit_things.forEach((reddit_link) => {
          this.emitRedditEvent(reddit_link);
        });
      }
      this.db.set("before", before);
    },
  },
  methods: {
    emitRedditEvent(reddit_event) {
      var { name: id, title: summary, created: ts } = reddit_event.data;
      this.$emit(reddit_event, {
        id,
        summary,
        ts,
      });
    },
  },
  async run() {
    let before = this.db.get("before");

    do {
      const reddit_things = await this.reddit.getNewSubredditLinks(
        before,
        this.subreddit
      );
      var links_pulled = this.reddit.wereLinksPulled(reddit_things);
      if (links_pulled) {
        before = reddit_things.data.children[0].data.name;
        this.db.set("before", before);
        const ordered_reddit_things = reddit_things.data.children.reverse();
        ordered_reddit_things.forEach((reddit_link) => {
          this.emitRedditEvent(reddit_link);
        });
      }
    } while (links_pulled);

  },
};
