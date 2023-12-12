import app from "../../app/twitter.app";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import { DeleteTweetParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/delete-tweets-id";

export default defineAction({
  key: "twitter-delete-tweet",
  name: "Delete Tweet",
  description: `Remove a posted tweet. [See the documentation](${DOCS_LINK})`,
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
      const params: DeleteTweetParams = {
        $,
        tweetId,
      };

      const response = await this.app.deleteTweet(params);

      $.export("$summary", `Successfully deleted tweet (ID ${tweetId})`);

      return response;
    } catch (err) {
      $.export("error", err);
      throw new Error(ACTION_ERROR_MESSAGE);
    }
  },
});
