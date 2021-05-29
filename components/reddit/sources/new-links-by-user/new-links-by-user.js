const reddit = require("../../reddit.app.js");
module.exports = {
  key: "new-links-by-user",
  name: "New links by user",
  description: "Emits an event each time a user posts a new link.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    reddit,
    username: { propDefinition: [reddit, "username"] },
    context: {
      type: "integer",
      label: "context",
      description: "an integer between 2 and 10",
    },
    t: {
      type: "string",
      label: "t",
      description: "one of (hour, day, week, month, year, all)",
      options: ["hour", "day", "week", "month", "year", "all"],
    },
    sr_detail: {
      type: "boolean",
      label: "Include Subreddit details?",
      description:
        "If set to true, includes details on the subreddit in the emitted event.",
      default: false,
    },
    timer: {
      label: "Polling schedule",
      description:
        "Pipedream polls Reddit on this schedule for new links by the prop indicated user.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 10, // by default, run every 10 minute.
      },
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      let before = null;
      try {
        var reddit_things = await this.reddit.getNewUserLinks(
          null,
          this.username,
          this.context,
          this.t,
          this.sr_detail,
          10
        );
      } catch (err) {
        if (this.reddit.did4xxErrorOccurred(err)) {
          throw new Error(
            `We encountered a 4xx error trying to fetch links by ${this.username}. Please check the username and try again.`
          );
        }
        throw err;
      }
      const reddit_links_pulled = this.reddit.wereThingsPulled(reddit_things);
      if (reddit_links_pulled) {
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
      const { name: id, title: summary, created: ts } = reddit_event.data;
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
      const reddit_things = await this.reddit.getNewUserLinks(
        before,
        this.username,
        this.context,
        this.t,
        this.sr_detail
      );
      var reddit_links_pulled = this.reddit.wereThingsPulled(reddit_things);
      if (reddit_links_pulled) {
        before = reddit_things.data.children[0].data.name;
        this.db.set("before", before);
        const ordered_reddit_things = reddit_things.data.children.reverse();
        ordered_reddit_things.forEach((reddit_link) => {
          this.emitRedditEvent(reddit_link);
        });
      }
    } while (reddit_links_pulled);
  },
};
