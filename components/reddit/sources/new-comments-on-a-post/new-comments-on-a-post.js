const common = require("../common");
const { reddit } = common.props;

module.exports = {
  ...common,
  key: "new-comments-on-a-post",
  name: "New comments on a post",
  description:
    "Emits an event each time a new comment is added to a subreddit.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    subreddit: {
      propDefinition: [reddit, "subreddit"],
    },
    subredditPost: {
      type: "string",
      label: "Post",
      description:
        "Pipedream will emit a new event when a comment is made on the selected post.",
      optional: false,
      async options() {
        const options = [];
        const results = await this.getAllSubredditPosts();
        for (const subreddit of results) {
          options.push({
            label: subreddit.title,
            value: subreddit.id,
          });
        }
        return options;
      },
    },
    numberOfParents: {
      type: "integer",
      label: "numberOfParents",
      description:
        "When set to 0, the emitted events will only contain the new comment. Otherwise, the events will also contain the parents of the new comment up to the number indicated in this property.",
      optional: true,
      min: 0,
      max: 8,
      default: 0,
    },
    depth: {
      type: "integer",
      label: "Depth",
      description:
        'If set to 1, it will include, in the emitted event, only new comments that are direct children to the subreddit pointed by "subredditPost". Furthermore, "depth" determines the maximum depth of children, within the related subreddit comment tree, of new comments to be included in said emitted event.',
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
        console.log("No data available, skipping iteration");
        return;
      }
      comments.reverse().forEach(this.emitRedditEvent);
    }
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
    async getAllSubredditPosts() {
      const results = [];
      let before = null;
      do {
        const redditLinks = await this.reddit.getNewSubredditLinks(
          before,
          this.subreddit
        );
        const { children: links = [] } = redditLinks.data;
        if (links.length === 0) {
          break;
        }
        before = links[0].data.name;
        links.forEach((link) => {
          const { title, id } = link.data;
          results.push({
            title,
            id,
          });
        });
      } while (before);
      return results;
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
      console.log("No data available, skipping iteration");
      return;
    }
    comments.reverse().forEach(this.emitRedditEvent);
  }
};
