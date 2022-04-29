import twitter from "../../twitter.app.mjs";
import xero_accounting_api from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-new-updated-contact",
  name: "New or updated contact",
  description:
    "Emit notifications when you create a new or updated existing contact",
  version: "0.0.1",
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
    (await this.twitter.getLikedTweets()).reverse().forEach((tweet) => {
      this.$emit(this.twitter.enrichTweet(tweet), {
        id: tweet.id_str,
        summary: tweet.full_text,
      });
    });
  },
};
