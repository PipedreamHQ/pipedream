import app from "../../app/twitter_v2.app";
import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getTweetSummary as getItemSummary } from "../common/getItemSummary";
import { tweetFieldProps } from "../../common/propGroups";
import { Tweet } from "../../common/types/responseSchemas";
import { getTweetFields } from "../../common/methods";
import { GetTweetParams } from "../../common/types/requestParams";

const DOCS_LINK = "https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/api-reference/get-tweets-id";

export default defineSource({
  ...common,
  key: "twitter_v2-new-retweet-posted",
  name: "New Retweet Posted",
  description: `Emit new event when the specified Tweet is retweeted [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    tweetId: {
      propDefinition: [
        app,
        "tweetId",
      ],
    },
    ...tweetFieldProps,
  },
  methods: {
    ...common.methods,
    getTweetFields,
    getItemSummary,
    getEntityName() {
      return "Retweet";
    },
    async getResources(): Promise<Tweet[]> {
      const tweetFields = this.tweetFields ?? [];
      if (!tweetFields.includes("referenced_tweets")) {
        tweetFields.push("referenced_tweets");
      }

      const expansions = this.expansions ?? [];
      if (!expansions.includes("referenced_tweets.id")) {
        expansions.push("referenced_tweets.id");
      }

      const params: GetTweetParams = {
        $: this,
        tweetId: this.tweetId,
        params: {
          "expansions": expansions.join(),
          "tweet.fields": tweetFields.join(),
        },
      };

      const {
        data: { referenced_tweets: referencedTweets }, includes,
      } = await this.app.getTweet(params);

      const retweetIds = referencedTweets?.filter(({ type }) => type === "retweeted").map(({ id }) => id);

      let retweets = [];
      if (retweetIds && includes) {
        retweets = includes.tweets.filter(({ id }) => retweetIds.includes(id));
      }

      return retweets;
    },
  },
});
