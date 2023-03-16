import app from "../app/twitter_v2.app";

export const listFieldProps = {
  expansions: {
    propDefinition: [
      app,
      "listExpansions",
    ],
  },
  listFields: {
    propDefinition: [
      app,
      "listFields",
    ],
  },
  userFields: {
    propDefinition: [
      app,
      "userFields",
    ],
    description:
      "Specific [user fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/user) to be included in the returned user object. Only applicable if you've requested the `owner_id` expansion.",
  },
};

export const tweetFieldProps = {
  expansions: {
    propDefinition: [
      app,
      "tweetExpansions",
    ],
  },
  mediaFields: {
    propDefinition: [
      app,
      "mediaFields",
    ],
  },
  placeFields: {
    propDefinition: [
      app,
      "placeFields",
    ],
  },
  pollFields: {
    propDefinition: [
      app,
      "pollFields",
    ],
  },
  tweetFields: {
    propDefinition: [
      app,
      "tweetFields",
    ],
  },
  userFields: {
    propDefinition: [
      app,
      "userFields",
    ],
  },
};

export const userFieldProps = {
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
