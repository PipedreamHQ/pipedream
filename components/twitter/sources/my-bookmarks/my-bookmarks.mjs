import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-my-bookmarks",
  name: "My Bookmarked Tweets",
  description: "Emit new Tweets you bookmarked on Twitter",
  version: "0.0.2",
  type: "source",
  props: {
    twitter,
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
    console.log(this.twitter.$auth);
    (await this.twitter.getBookmarkedTweets()).reverse().forEach((tweet) => {
      this.$emit(this.twitter.enrichTweet(tweet), {
        id: tweet.id_str,
        summary: tweet.full_text,
      });
    });
  },
};
