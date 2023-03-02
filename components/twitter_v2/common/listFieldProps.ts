import app from "../app/twitter_v2.app";

export default {
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
