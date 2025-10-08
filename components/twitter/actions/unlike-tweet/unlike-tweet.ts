import common from "../../common/appValidation";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import { UnlikeTweetParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/likes/api-reference/delete-users-id-likes-tweet_id";

export default defineAction({
  ...common,
  key: "twitter-unlike-tweet",
  name: "Unlike Tweet",
  description: `Unlike a tweet specified by its ID. [See the documentation](${DOCS_LINK})`,
  version: "2.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    tweetId: {
      propDefinition: [
        common.props.app,
        "tweetId",
      ],
    },
  },
  async run({ $ }): Promise<object> {
    const { tweetId } = this;
    const params: UnlikeTweetParams = {
      $,
      tweetId,
      fallbackError: ACTION_ERROR_MESSAGE,
    };

    const response = await this.app.unlikeTweet(params);

    $.export("$summary", `Successfully unliked tweet ${tweetId}`);

    return response;
  },
});
