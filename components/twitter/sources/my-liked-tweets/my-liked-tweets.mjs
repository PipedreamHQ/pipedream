import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-my-liked-tweets",
  name: "My Liked Tweets",
  description: "Emit new Tweets you like on Twitter",
  version: "0.0.7",
  type: "source",
  props: {
    twitter,
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Twitter API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  dedupe: "unique",
  async run() {
    (await this.twitter.getLikedTweets()).reverse().forEach((tweet) => {
      this.$emit(this.twitter.enrichTweet(tweet), {
        id: tweet.id_str,
        summary: tweet.full_text,
      });
    });
  },
};
