import app from "../app/twitter_v2.app";

export default {
  expansions: {
    propDefinition: [
      app,
      "userExpansions",
    ],
  },
  tweetFields: {
    propDefinition: [
      app,
      "tweetFields",
    ],
    description:
      "Specific [tweet fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/tweet) to be included in the returned pinned Tweet. Only applicable if the user has a pinned Tweet and you've requested the `referenced_tweets.id` expansion.",
  },
  userFields: {
    propDefinition: [
      app,
      "userFields",
    ],
    description:
      "Specific [user fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/user) to be included in the returned user object.",
  },
};
