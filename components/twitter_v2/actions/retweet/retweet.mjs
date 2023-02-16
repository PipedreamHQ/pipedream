import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-retweet",
  name: "Retweet a tweet",
  description: "Retweets a specific tweet by ID. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-retweet-id)",
  version: "0.0.3",
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
  async run({ $ }) {
    const res = await this.twitter.retweet({
      $,
      tweetID: this.tweetID,
    });
    $.export("$summary", "Tweet successfully retweeted");
    return res;
  },
};
