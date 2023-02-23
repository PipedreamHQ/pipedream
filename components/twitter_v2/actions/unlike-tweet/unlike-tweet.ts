import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import { UnlikeTweetParams } from "../../common/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/likes/api-reference/delete-users-id-likes-tweet_id";

export default defineAction({
  key: "twitter_v2-like-tweet",
  name: "Like Tweet",
  description: `Unlike a tweet specified by its ID. [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
  type: "action",
  props: {
    app,
    tweetId: {
      propDefinition: [
        app,
        "tweetId",
      ],
    },
  },
  async run({ $ }): Promise<object> {
    const params: UnlikeTweetParams = {
      $,
      tweetId: this.tweetId,
    };

    const response = await this.app.unlikeTweet(params);

    $.export("$summary", "Successfully unliked tweet");

    return response;
  },
});
