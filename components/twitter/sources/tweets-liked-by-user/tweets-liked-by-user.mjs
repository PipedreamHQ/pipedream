import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-tweet-liked-by-user",
  name: "Tweet Liked by User",
  description: "Emit new Tweets liked by a specific user on Twitter",
  version: "0.0.7",
  type: "source",
  props: {
    twitter,
    screenName: {
      propDefinition: [
        twitter,
        "screenName",
      ],
    },
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Twitter API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  dedupe: "unique",
  async run() {
    (await this.twitter.getLikedTweets({
      screenName: this.screen_name,
    })).reverse().forEach((tweet) => {
      this.$emit(this.twitter.enrichTweet(tweet), {
        id: tweet.id_str,
        summary: tweet.full_text,
      });
    });
  },
};
