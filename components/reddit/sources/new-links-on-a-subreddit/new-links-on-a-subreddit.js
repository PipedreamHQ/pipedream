const common = require("../common");
const { reddit } = common.props;

module.exports = {
  ...common,
  key: "new-links-on-a-subreddit",
  name: "New Links on a subreddit",
  description: "Emits an event each time a new link is added to a subreddit",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    subreddit: {
      propDefinition: [reddit, "subreddit"],
    },
  },
  hooks: {
    async deploy() {
      // Emits 10 sample events on the first run during deploy.
      var redditLinks = await this.reddit.getNewSubredditLinks(
        null,
        this.subreddit,
        10
      );
      const { children: links = [] } = redditLinks.data;
      if (links.length === 0) {
        console.log("No data available, skipping iteration");
        return;
      }
      const { name: before = this.db.get("before") } = links[0].data;
      this.db.set("before", before);
      links.reverse().forEach(this.emitRedditEvent);
    }
  },
  methods: {
    ...common.methods,
    generateEventMetadata(redditEvent) {
      return {
        id: redditEvent.data.name,
        summary: redditEvent.data.title,
        ts: redditEvent.data.created,
      };
    }
  },
  async run() {
    let redditLinks;
    do {
      redditLinks = await this.reddit.getNewSubredditLinks(
        this.db.get("before"),
        this.subreddit
      );
      const { children: links = [] } = redditLinks.data;
      if (links.length === 0) {
        console.log("No data available, skipping iteration");
        break;
      }
      const { name: before = this.db.get("before") } = links[0].data;
      this.db.set("before", before);
      links.reverse().forEach(this.emitRedditEvent);
    } while (redditLinks);
  },
};
