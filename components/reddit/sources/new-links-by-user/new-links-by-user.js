const common = require("../common");
const { reddit } = common.props;

module.exports = {
  ...common,
  key: "new-links-by-user",
  name: "New links by user",
  description: "Emits an event each time a user posts a new link.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    username: { propDefinition: [common.props.reddit, "username"] },
    numberOfParents: {
      type: "integer",
      label: "Number of parents",
      description:
        "The emitted events will contain the new comment plus the parents of said comment up to the number indicated in this property.",
      default: 2,
      min: 2,
      max: 10
    },
    timeFilter: { propDefinition: [reddit, "timeFilter"] },
    includeSubredditDetails: {
      propDefinition: [reddit, "includeSubredditDetails"],
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      let before = null;
      var redditLinks = await this.reddit.getNewUserLinks(
        null,
        this.username,
        this.numberOfParents,
        this.timeFilter,
        this.includeSubredditDetails,
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
      const redditLinks = await this.reddit.getNewUserLinks(
        before,
        this.username,
        this.numberOfParents,
        this.timeFilter,
        this.includeSubredditDetails
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
