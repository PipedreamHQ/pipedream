const common = require("../../common");
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
    reddit,
    subreddit: {
      propDefinition: [reddit, "subreddit"],
    },
    subreddit_id36: {
      type: "string",
      label: "ID36 of Subreddit",
      description:
        "Pipedream will emit a new event when a comment is posted to the subreddit pointed by this ID36.",
      optional: false,
    },
    context: {
      type: "integer",
      label: "Context (0 to 8)",
      description:
        "If set to 0, it will include the new comment in the emitted event. Otherwise, it specifies how many parents of the new comment will be included in said event.",
      default: 0,
      optional: false,
    },
    depth: {
      type: "integer",
      label: "Depth",
      description:
        'If set to 1, it will include, in the emitted event, only new comments that are direct children to the subreddit pointed by "subreddit_id36". Furthermore, "depth" determines the maximum depth of children, within the related subreddit comment tree, of new comments to be included in said emitted event.',
      default: 1,
      optional: true,
    },
    sr_detail: { propDefinition: [reddit, "sr_detail"] },
    ...common.props,
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      try {
        var reddit_comments = await this.reddit.getNewSubredditComments(
          this.subreddit,
          this.subreddit_id36,
          this.context,
          this.depth,
          this.sr_detail,
          10
        );
      } catch (err) {
        if (common.methods.did4xxErrorOccur(err)) {
          throw new Error(`
            We encountered a 4xx error trying to fetch comments for ${this.subreddit}. Please check the subreddit name and try again.`);
        }
        throw err;
      }
      const reddit_comments_pulled = common.methods.wereThingsPulled(
        reddit_comments
      );
      if (reddit_comments_pulled) {
        const ordered_reddit_comments = reddit_comments.data.children.reverse();
        ordered_reddit_comments.forEach((reddit_comment) => {
          this.emitRedditEvent(reddit_comment);
        });
      }
    },
  },
  methods: {
    ...common.methods,
    generateEventMetadata(reddit_event) {
      return {
        id: reddit_event.data.name,
        summary: reddit_event.data.body,
        ts: reddit_event.data.created,
      };
    },
    emitRedditEvent(reddit_event) {
      const emitRedditEventHandler = common.methods.emitRedditEvent.bind(this);
      emitRedditEventHandler(reddit_event);
    },
  },
  async run() {
    const reddit_comments = await this.reddit.getNewSubredditComments(
      this.subreddit,
      this.subreddit_id36,
      this.context,
      this.depth,
      this.sr_detail
    );
    var reddit_comments_pulled = common.methods.wereThingsPulled(
      reddit_comments
    );
    if (reddit_comments_pulled) {
      before = reddit_comments.data.children[0].data.name;
      this.db.set("before", before);
      const ordered_reddit_comments = reddit_comments.data.children.reverse();
      ordered_reddit_comments.forEach((reddit_comment) => {
        this.emitRedditEvent(reddit_comment);
      });
    }
  },
};
