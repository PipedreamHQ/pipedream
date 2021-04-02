const base = require("../common/tweets");

module.exports = {
  ...base,
  key: "twitter-user-tweets",
  name: "User Tweets",
  description: "Emit new Tweets posted by a user",
  version: "0.0.5",
  props: {
    ...base.props,
    screen_name: {
      propDefinition: [
        base.props.twitter,
        "screen_name",
      ],
    },
    includeRetweets: {
      propDefinition: [
        base.props.twitter,
        "includeRetweets",
      ],
    },
    includeReplies: {
      propDefinition: [
        base.props.twitter,
        "includeReplies",
      ],
    },
  },
  methods: {
    ...base.methods,
    shouldExcludeReplies() {
      return this.includeReplies === "exclude";
    },
    shouldIncludeRetweets() {
      return this.includeRetweets !== "exclude";
    },
    retrieveTweets() {
      return this.twitter.getUserTimeline({
        screen_name: this.screen_name,
        count: this.count,
        since_id: this.getSinceId(),
        exclude_replies: this.shouldExcludeReplies(),
        include_rts: this.shouldIncludeRetweets(),
      });
    },
  },
};
