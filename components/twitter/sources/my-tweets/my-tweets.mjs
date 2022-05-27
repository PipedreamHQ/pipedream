import base from "../common/tweets.mjs";

export default {
  ...base,
  key: "twitter-my-tweets",
  name: "My Tweets",
  description: "Emit new Tweets you post to Twitter",
  version: "0.0.9",
  type: "source",
  props: {
    ...base.props,
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
    async getScreenName() {
      const { screen_name: screenName } = await this.twitter.verifyCredentials();
      return screenName;
    },
    async retrieveTweets() {
      const screenName = await this.getScreenName();
      return this.twitter.getUserTimeline({
        screenName,
        count: this.count,
        sinceId: this.getSinceId(),
        excludeReplies: this.shouldExcludeReplies(),
        includeRts: this.shouldIncludeRetweets(),
      });
    },
  },
};
