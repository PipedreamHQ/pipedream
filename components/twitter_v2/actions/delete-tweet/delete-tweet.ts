import app from "../../app/twitter.app";
import { defineAction } from "@pipedream/types";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/delete-tweets-id";

export default defineAction({
  name: "Delete Tweet",
  description: `Remove a posted tweet. [See docs here](${DOCS_LINK})`,
  key: "twitter-delete-tweet",
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
  async run({ $ }): Promise<boolean> {
    const params = {
      $,
      tweetId: this.tweetId,
    };

    const response = await this.app.deleteTweet(params);

    $.export("$summary", "Successfully deleted tweet");

    return response;
  },
});
