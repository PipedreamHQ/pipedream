import app from "../../app/twitter.app";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import { UnlikeTweetParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/likes/api-reference/delete-users-id-likes-tweet_id";

export default defineAction({
  key: "twitter-unlike-tweet",
  name: "Unlike Tweet",
  description: `Unlike a tweet specified by its ID. [See the documentation](${DOCS_LINK})`,
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
      const params: UnlikeTweetParams = {
        $,
        tweetId,
      };

      const response = await this.app.unlikeTweet(params);

      $.export("$summary", `Successfully unliked tweet ${tweetId}`);

      return response;
    } catch (err) {
      $.export("error", err);
      throw new Error(ACTION_ERROR_MESSAGE);
    }
  },
});
