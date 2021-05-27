const base = require("../common/tweets");
const baseRetweets = require("../watch-retweets-of-my-tweet/watch-retweets-of-my-tweet");

module.exports = {
  ...baseRetweets,
  key: "twitter-watch-retweets-of-user-tweet",
  name: "Watch Retweets of User Tweet",
  description: "Emit an event when a specific Tweet from a user is retweeted",
  version: "0.0.1",
  props: {
    ...base.props,
    screen_name: {
      propDefinition: [
        base.props.twitter,
        "screen_name",
      ],
    },
    tweetId: {
      type: "string",
      label: "Tweet",
      description: "The Tweet to watch for retweets",
      options(context) {
        return this.tweetIdOptions(context);
      },
    },
  },
  methods: {
    ...baseRetweets.methods,
    getScreenName() {
      return this.screen_name;
    },
  },
};
