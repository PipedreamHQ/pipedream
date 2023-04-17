import app from "../../app/twitter.app";
import { defineAction } from "@pipedream/types";
import { DeleteTweetParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/delete-tweets-id";

export default defineAction({
  key: "twitter-delete-tweet",
  name: "Delete Tweet",
  description: `Remove a posted tweet. [See docs here](${DOCS_LINK})`,
  version: "1.0.0",
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
    const params: DeleteTweetParams = {
      $,
      tweetId: this.tweetId,
    };

    const response = await this.app.deleteTweet(params);

    $.export("$summary", "Successfully deleted tweet");

    return response;
  },
});
