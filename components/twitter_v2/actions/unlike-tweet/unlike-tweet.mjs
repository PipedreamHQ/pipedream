import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-unlike-tweet",
  name: "Unike Tweet",
  description: "Unike the tweet specified specified in the ID parameter. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-favorites-destroy)",
  version: "0.0.2",
  type: "action",
  props: {
    twitter,
    id: {
      propDefinition: [
        twitter,
        "tweetID",
      ],
    },
    includeEntities: {
      propDefinition: [
        twitter,
        "includeEntities",
      ],
    },
  },
  async run({ $ }) {
    const {
      id,
      includeEntities,
    } = this;

    const params = {
      $,
      id,
      includeEntities,
    };

    const res = this.twitter.unlikeTweet(params);
    $.export("$summary", "Successfully unliked tweet");
    return res;
  },
};
