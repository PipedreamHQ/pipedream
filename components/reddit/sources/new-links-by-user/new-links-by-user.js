const common = require("../common");
const { reddit } = common.props;

module.exports = {
  ...common,
  key: "new-links-by-user",
  name: "New links by user",
  description: "Emits an event each time a user posts a new link.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    username: { propDefinition: [reddit, "username"] },
    numberOfParents: {
      type: "integer",
      label: "Number of parents",
      description:
        "The emitted events will contain the new comment plus the parents of said comment up to the number indicated in this property.",
      optional: true,
      min: 2,
      max: 10,
      default: 2,
    },
    timeFilter: { propDefinition: [reddit, "timeFilter"] },
    includeSubredditDetails: {
      propDefinition: [reddit, "includeSubredditDetails"],
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      var redditLinks = await this.reddit.getNewUserLinks(
        null,
        this.username,
        this.numberOfParents,
        this.timeFilter,
        this.includeSubredditDetails,
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
      redditLinks = await this.reddit.getNewUserLinks(
        this.db.get("before"),
        this.username,
        this.numberOfParents,
        this.timeFilter,
        this.includeSubredditDetails
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
