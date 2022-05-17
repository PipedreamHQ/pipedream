import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-get-tweet",
  name: "Get Tweet",
  description: "Return a single tweet specified by ID. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/get-statuses-show-id)",
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

    const res = await this.twitter.getTweet({
      $,
      ...params,
    });
    $.export("$summary", "Successfully retrieved tweet");
    return res;
  },
};
