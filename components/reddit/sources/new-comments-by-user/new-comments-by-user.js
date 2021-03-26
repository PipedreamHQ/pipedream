const common = require("../common");
const { reddit } = common.props;

module.exports = {
  ...common,
  key: "new-comments-by-user",
  name: "New comments by user",
  description: "Emits an event each time a user posts a new comment.",
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
    timeFilter: { propDefinition: [common.props.reddit, "timeFilter"] },
    includeSubredditDetails: {
      propDefinition: [reddit, "includeSubredditDetails"],
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      let before = null;
      var redditComments = await this.reddit.getNewUserComments(
        before,
        this.username,
        this.numberOfParents,
        this.timeFilter,
        this.includeSubredditDetails,
        10
      );
      if (!redditComments) {
        console.log("No data available, skipping emitting sample events");
        return;
      }
      before = redditComments[0].data.name;
      const orderedRedditComments = redditComments.reverse();
      orderedRedditComments.forEach((redditComment) => {
        this.emitRedditEvent(redditComment);
      });
      this.db.set("before", before);
    },
  },
  methods: {
    ...common.methods,
    generateEventMetadata(redditEvent) {
      return {
        id: redditEvent.data.name,
        summary: redditEvent.data.body,
        ts: redditEvent.data.created,
      };
    },
  },
  async run() {
    let before = this.db.get("before");
    do {
      const redditComments = await this.reddit.getNewUserComments(
        before,
        this.username,
        this.numberOfParents,
        this.timeFilter,
        this.includeSubredditDetails
      );
      if (!redditComments) {
        console.log("No data available, skipping itieration");
        break;
      }
      before = redditComments[0].data.name;
      const orderedRedditComments = redditComments.reverse();
      orderedRedditComments.forEach((redditComment) => {
        this.emitRedditEvent(redditComment);
      });
      this.db.set("before", before);
    } while (redditComments);
  },
};
