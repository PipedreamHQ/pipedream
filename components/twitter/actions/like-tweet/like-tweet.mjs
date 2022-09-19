import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-like-tweet",
  name: "Like Tweet",
  description: "Like the tweet specified specified in the ID parameter. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-favorites-create)",
  version: "0.0.1",
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
      id,
      includeEntities,
    };

    const res = await this.twitter.likeTweet({
      $,
      ...params,
    });
    $.export("$summary", "Successfully liked tweet");
    return res;
  },
};
