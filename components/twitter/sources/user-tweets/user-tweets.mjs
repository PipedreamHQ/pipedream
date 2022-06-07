import base from "../common/tweets.mjs";

export default {
  ...base,
  key: "twitter-user-tweets",
  name: "User Tweets",
  description: "Emit new Tweets posted by a user",
  version: "0.0.9",
  type: "source",
  props: {
    ...base.props,
    screenName: {
      propDefinition: [
        base.props.twitter,
        "screenName",
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
        screenName: this.screenName,
        count: this.count,
        sinceId: this.getSinceId(),
        excludeReplies: this.shouldExcludeReplies(),
        includeRts: this.shouldIncludeRetweets(),
      });
    },
  },
};
