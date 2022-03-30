import common from "../common.mjs";
const { reddit } = common.props;

export default {
  ...common,
  type: "source",
  key: "reddit-new-comments-by-user",
  name: "New Comments by User",
  description: "Emit new event each time a user posts a new comment.",
  version: "0.0.4",
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
      const {
        name = this._getBefore()?.name,
        id,
        link_id: linkId,
        subreddit,
      } = comments[0].data;
      this._setBefore({
        name,
        id,
        article: linkId.slice(3),
        subreddit,
      });
      const cache = this.getCommentsData(comments);
      this._setCache(cache);
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
    async isBeforeValid(before) {
      // verify this comment still exists as a comment by this user
      const res = await this.reddit.getComment(before);
      const author = res[1]?.data?.children[0]?.data?.author;
      return author === this.username;
    },
    getCommentsData(comments) {
      return comments.map((comment) => ({
        name: comment?.data?.name,
        id: comment?.data?.id,
        article: comment?.data?.link_id.slice(3),
        subreddit: comment?.data?.subreddit,
      })).reverse();
    },
  },
  async run() {
    let redditComments;
    const emittedEvents = [];
    await this.validateBefore(this._getCache(), this._getBefore());
    do {
      redditComments = await this.reddit.getNewUserComments(
        this._getBefore()?.name,
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
      const {
        name = this._getBefore()?.name,
        id,
        link_id: linkId,
        subreddit,
      } = comments[0].data;
      this._setBefore({
        name,
        id,
        article: linkId.slice(3),
        subreddit,
      });
      const cacheData = this.getCommentsData(comments);
      emittedEvents.push(...cacheData);

      comments.reverse().forEach(this.emitRedditEvent);
    } while (redditComments);
    const cache = this._getCache();
    cache.push(...emittedEvents);
    this._setCache(cache);
  },
};
