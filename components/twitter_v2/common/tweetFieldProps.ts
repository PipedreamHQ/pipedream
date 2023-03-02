import app from "../app/twitter_v2.app";

export default {
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
