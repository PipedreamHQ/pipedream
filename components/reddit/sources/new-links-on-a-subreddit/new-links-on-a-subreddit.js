const common = require("../../common");
const { reddit } = common.props;

module.exports = {
  ...common,
  key: "new-links-on-a-subreddit",
  name: "New Links on a subreddit",
  description: "Emits an event each time a new link is added to a subreddit",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    reddit,
    subreddit: {
      propDefinition: [reddit, "subreddit"],
    },
    ...common.props,
  },
  hooks: {
    async deploy() {
      // Emits 10 sample events on the first run during deploy.
      let before = null;
      try {
        var reddit_links = await this.reddit.getNewSubredditLinks(
          null,
          this.subreddit,
          10
        );
      } catch (err) {
        if (common.methods.did4xxErrorOccur(err)) {
          throw new Error(
            `We encountered a 4xx error trying to fetch links for ${this.subreddit}. Please check the subreddit name and try again`
          );
        }
        throw err;
      }
      const reddit_links_pulled = common.methods.wereThingsPulled(reddit_links);
      if (reddit_links_pulled) {
        before = reddit_links.data.children[0].data.name;
        const ordered_reddit_links = reddit_links.data.children.reverse();
        ordered_reddit_links.forEach((reddit_link) => {
          this.emitRedditEvent(reddit_link);
        });
      }
      this.db.set("before", before);
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
    let before = this.db.get("before");

    do {
      const reddit_links = await this.reddit.getNewSubredditLinks(
        before,
        this.subreddit
      );
      var reddit_links_pulled = common.methods.wereThingsPulled(reddit_links);
      if (reddit_links_pulled) {
        before = reddit_links.data.children[0].data.name;
        this.db.set("before", before);
        const ordered_reddit_links = reddit_links.data.children.reverse();
        ordered_reddit_links.forEach((reddit_link) => {
          this.emitRedditEvent(reddit_link);
        });
      }
    } while (reddit_links_pulled);
  },
};
