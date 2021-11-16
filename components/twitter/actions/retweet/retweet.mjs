import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-retweet",
  name: "Retweet a tweet",
  description: "Retweets a specific tweet by ID",
  version: "0.0.2",
  type: "action",
  props: {
    twitter,
    tweetID: {
      propDefinition: [
        twitter,
        "tweetID",
      ],
      description: "The numerical ID of the tweet you'd like to retweet",
    },
  },
  async run() {
    return this.twitter.retweet({
      tweetID: this.tweetID,
    });
  },
};
