const twitter = require("../../twitter.app.js");

module.exports = {
  key: "twitter-retweet",
  name: "Retweet a tweet",
  description: "Retweets a specific tweet by ID",
  version: "0.0.1",
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
    return await this.twitter.retweet({
      tweetID: this.tweetID,
    });
  },
};
