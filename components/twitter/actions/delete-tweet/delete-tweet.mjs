import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-delete-tweet",
  name: "Delete Tweet",
  description: "Remove a posted tweet",
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
  async run() {
    const {
      tweetID,
      trimUser,
    } = this;

    const params = {
      tweetID,
      trimUser,
    };

    return this.twitter.deleteTweet(params);
  },
};
