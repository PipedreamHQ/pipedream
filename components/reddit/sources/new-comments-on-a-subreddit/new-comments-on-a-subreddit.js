const common = require("../common");
const { reddit } = common.props;

module.exports = {
  ...common,
  key: "new-comments-on-a-subreddit",
  name: "New comments on a subreddit",
  description:
    "Emits an event each time a new comment is added to a subreddit.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    subreddit: {
      propDefinition: [common.props.reddit, "subreddit"],
    },
    subredditPost: {
      type: "string",
      label: "ID36 of subreddit",
      description:
        "Pipedream will emit a new event when a comment is posted to the subreddit pointed by this ID36.",
      optional: false,
    },
    numberOfParents: {
      type: "integer",
      label: "numberOfParents",
      description:
        "When set to 0, the emitted events will only contain the new comment. Otherwise, the events will also contain the parents of the new comment up to the number indicated in this property.",
      default: 0,
      min: 0,
      max: 8
    },
    depth: {
      type: "integer",
      label: "Depth",
      description:
        "If set to 1, it will include, in the emitted event, only new comments that are direct children to the subreddit pointed by \"subredditPost\". Furthermore, \"depth\" determines the maximum depth of children, within the related subreddit comment tree, of new comments to be included in said emitted event.",
      default: 1,
      optional: true,
    },
    includeSubredditDetails: {
      propDefinition: [reddit, "includeSubredditDetails"],
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      var redditComments = await this.reddit.getNewSubredditComments(
        this.subreddit,
        this.subredditPost,
        this.numberOfParents,
        this.depth,
        this.includeSubredditDetails,
        10
      );
      const { children: comments = [] } = redditComments.data;
      if (comments.length === 0) {
        console.log("No data available, skipping itieration");
        return;
      }
      comments.reverse().forEach(this.emitRedditEvent);
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
    const redditComments = await this.reddit.getNewSubredditComments(
      this.subreddit,
      this.subredditPost,
      this.numberOfParents,
      this.depth,
      this.includeSubredditDetails
    );
    const { children: comments = [] } = redditComments.data;
    if (comments.length === 0) {
      console.log("No data available, skipping itieration");
      return;
    }
    comments.reverse().forEach(this.emitRedditEvent);
  },
};
