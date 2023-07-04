import app from "../../app/twitter.app";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import { LikeTweetParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/likes/api-reference/post-users-id-likes";

export default defineAction({
  key: "twitter-like-tweet",
  name: "Like Tweet",
  description: `Like a tweet specified by its ID. [See the documentation](${DOCS_LINK})`,
  version: "2.0.3",
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
    try {
      const { tweetId } = this;
      const params: LikeTweetParams = {
        $,
        data: {
          tweet_id: tweetId,
        },
      };

      const response = await this.app.likeTweet(params);

      $.export("$summary", `Successfully liked tweet (ID ${tweetId})`);

      return response;
    } catch (err) {
      $.export("error", err);
      throw new Error(ACTION_ERROR_MESSAGE);
    }
  },
});
