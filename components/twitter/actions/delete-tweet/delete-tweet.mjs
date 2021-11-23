import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-delete-tweet",
  name: "Delete Tweet",
  description: "Remove a posted tweet. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-destroy-id)",
  version: "0.0.1",
  type: "action",
  props: {
    twitter,
    tweetID: {
      propDefinition: [
        twitter,
        "tweetID",
      ],
    },
    trimUser: {
      propDefinition: [
        twitter,
        "trimUser",
      ],
    },
  },
  async run({ $ }) {
    const {
      tweetID,
      trimUser,
    } = this;

    const params = {
      tweetID,
      trimUser,
    };

    const res = await this.twitter.deleteTweet({
      $,
      ...params,
    });
    $.export("$summary", "Successfully deleted tweet");
    return res;
  },
};
