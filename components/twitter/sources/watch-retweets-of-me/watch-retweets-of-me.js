const base = require("../common/tweets");

module.exports = {
  ...base,
  key: "twitter-watch-retweets-of-me",
  name: "Watch Retweets of Me",
  description: "Emit an event when recent Tweets authored by the authenticating user that have been retweeted by others",
  version: "0.0.2",
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
        since_id: this.getSinceId(),
        include_entities: this.includeEntities,
        include_user_entities: this.includeUserEntities,
      });
    },
  },
};
