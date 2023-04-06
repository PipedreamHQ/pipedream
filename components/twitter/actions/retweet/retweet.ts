import app from "../../app/twitter.app";
import { defineAction } from "@pipedream/types";
import { RetweetParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/retweets/api-reference/post-users-id-retweets";

export default defineAction({
  key: "twitter-retweet",
  name: "Retweet a tweet",
  description: `Retweet a tweet specified by ID. [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
  type: "action",
  props: {
    app,
    tweetId: {
      propDefinition: [
        app,
        "tweetId",
      ],
      description: "The ID of the tweet you'd like to retweet",
    },
  },
  async run({ $ }): Promise<object> {
    const params: RetweetParams = {
      $,
      data: {
        tweet_id: this.tweetId,
      },
    };

    const response = await this.app.retweet(params);

    $.export("$summary", "Tweet successfully retweeted");

    return response;
  },
});
