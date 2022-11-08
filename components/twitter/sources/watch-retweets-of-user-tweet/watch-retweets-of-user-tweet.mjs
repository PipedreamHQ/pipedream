import base from "../common/tweets.mjs";
import baseRetweets from "../watch-retweets-of-my-tweet/watch-retweets-of-my-tweet.mjs";

export default {
  ...baseRetweets,
  key: "twitter-watch-retweets-of-user-tweet",
  name: "Watch Retweets of User Tweet",
  description: "Emit new event when a specific Tweet from a user is retweeted",
  version: "0.0.5",
  type: "source",
  props: {
    ...base.props,
    screenName: {
      propDefinition: [
        base.props.twitter,
        "screenName",
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
      return this.screenName;
    },
  },
};
