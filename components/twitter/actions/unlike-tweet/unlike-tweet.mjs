import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-unlike-tweet",
  name: "Unike Tweet",
  description: "Unike the tweet specified specified in the ID parameter",
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
    includeEntities: {
      propDefinition: [
        twitter,
        "includeEntities",
      ],
    },
  },
  async run() {
    const {
      tweetID,
      includeEntities,
    } = this;

    const params = {
      id: tweetID,
      includeEntities,
    };

    return await this.twitter.unlikeTweet(params);
  },
};
