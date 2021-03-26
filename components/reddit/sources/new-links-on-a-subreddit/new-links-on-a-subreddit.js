const common = require("../common");
const { reddit } = common.props;

module.exports = {
  ...common,
  key: "new-links-on-a-subreddit",
  name: "New Links on a subreddit",
  description: "Emits an event each time a new link is added to a subreddit",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    subreddit: {
      propDefinition: [common.props.reddit, "subreddit"],
    },
  },
  hooks: {
    async deploy() {
      // Emits 10 sample events on the first run during deploy.
      let before = null;
      var redditLinks = await this.reddit.getNewSubredditLinks(
        before,
        this.subreddit,
        10
      );
      if (!redditLinks) {
        console.log("No data available, skipping emitting sample events");
        return;
      }
      before = redditLinks[0].data.name;
      const orderedRedditLinks = redditLinks.reverse();
      orderedRedditLinks.forEach((redditLink) => {
        this.emitRedditEvent(redditLink);
      });
      this.db.set("before", before);
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
    let before = this.db.get("before");
    do {
      const redditLinks = await this.reddit.getNewSubredditLinks(
        before,
        this.subreddit
      );
      if (!redditLinks) {
        console.log("No data available, skipping itieration");
        break;
      }
      before = redditLinks[0].data.name;
      this.db.set("before", before);
      const orderedRedditLinks = redditLinks.reverse();
      orderedRedditLinks.forEach((redditLink) => {
        this.emitRedditEvent(redditLink);
      });
    } while (redditLinks);
  },
};
