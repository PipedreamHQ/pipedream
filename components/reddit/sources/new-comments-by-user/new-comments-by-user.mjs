import common from "../common.mjs";
const { reddit } = common.props;

export default {
  ...common,
  type: "source",
  key: "reddit-new-comments-by-user",
  name: "New Comments by User",
  description: "Emit new event each time a user posts a new comment.",
  version: "0.1.3",
  dedupe: "unique",
  props: {
    ...common.props,
    username: {
      propDefinition: [
        reddit,
        "username",
      ],
    },
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
    timeFilter: {
      propDefinition: [
        reddit,
        "timeFilter",
      ],
    },
    includeSubredditDetails: {
      propDefinition: [
        reddit,
        "includeSubredditDetails",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      var redditComments = await this.reddit.getNewUserComments(
        null,
        this.username,
        this.numberOfParents,
        this.timeFilter,
        this.includeSubredditDetails,
        10,
      );
      const { children: comments = [] } = redditComments.data;
      if (comments.length === 0) {
        console.log("No data available, skipping iteration");
        return;
      }
      const { name = this._getBefore() } = comments[0].data;
      this._setBefore(name);
      const {
        cache,
        keys,
      } = this.getAllCommentsData(comments);
      this._setCache(cache);
      this._setKeys(keys);
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
    async isBeforeValid(before, cache) {
      // verify this comment still exists as a comment by this user
      const res = await this.reddit.getComment(cache[before]);
      const author = res[1]?.data?.children[0]?.data?.author;
      return author === this.username;
    },
    getCommentData(comment) {
      return {
        name: comment?.data?.name,
        id: comment?.data?.id,
        article: comment?.data?.link_id.slice(3),
        subreddit: comment?.data?.subreddit,
      };
    },
    getAllCommentsData(comments) {
      const cache = this._getCache();
      const keys = this._getKeys();
      comments.reverse().forEach((comment) => {
        cache[comment?.data?.name] = this.getCommentData(comment);
        keys.push(comment?.data?.name);
      });
      return {
        cache,
        keys,
      };
    },
  },
  async run() {
    let redditComments;
    const {
      cache: previousEmittedEvents,
      keys,
    } = await this.validateBefore(this._getCache(),
      this._getBefore(),
      this._getKeys());
    do {
      redditComments = await this.reddit.getNewUserComments(
        this._getBefore(),
        this.username,
        this.numberOfParents,
        this.timeFilter,
        this.includeSubredditDetails,
      );
      const { children: comments = [] } = redditComments.data;
      if (comments.length === 0) {
        console.log("No data available, skipping iteration");
        break;
      }
      const { name = this._getBefore() } = comments[0].data;
      this._setBefore(name);

      comments.reverse().forEach((comment) => {
        if (!previousEmittedEvents[comment.data.name]) {
          previousEmittedEvents[comment.data.name] = this.getCommentData(comment);
          keys.push(comment.data.name);
          this.emitRedditEvent(comment);
        }
      });
    } while (redditComments);
    this._setCache(previousEmittedEvents);
    this._setKeys(keys);
  },
};
