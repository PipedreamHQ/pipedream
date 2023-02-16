import twitter from "../../twitter.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "twitter-my-liked-tweets",
  name: "My Liked Tweets",
  description: "Emit new Tweets you like on Twitter",
  version: "0.0.10",
  type: "source",
  props: {
    twitter,
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Twitter API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
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
