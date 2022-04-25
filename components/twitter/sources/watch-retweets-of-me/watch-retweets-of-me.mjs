import base from "../common/tweets.mjs";

export default {
  ...base,
  key: "twitter-watch-retweets-of-me",
  name: "Watch Retweets of Me",
  version: "0.0.5",
  description: "Emit new event when recent Tweets authored by the authenticating user that have been retweeted by others",
  type: "source",
  props: {
    ...base.props,
    includeEntities: {
      propDefinition: [
        base.props.twitter,
        "includeEntities",
      ],
    },
    includeUserEntities: {
      propDefinition: [
        base.props.twitter,
        "includeUserEntities",
      ],
    },
  },
  methods: {
    ...base.methods,
    retrieveTweets() {
      return this.twitter.getRetweetsOfMe({
        count: this.count,
        sinceId: this.getSinceId(),
        includeEntities: this.includeEntities,
        includeUserEntities: this.includeUserEntities,
      });
    },
  },
};
