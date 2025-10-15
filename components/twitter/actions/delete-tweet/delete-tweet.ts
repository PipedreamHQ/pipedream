import common from "../../common/appValidation";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import { DeleteTweetParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/delete-tweets-id";

export default defineAction({
  ...common,
  key: "twitter-delete-tweet",
  name: "Delete Tweet",
  description: `Remove a posted tweet. [See the documentation](${DOCS_LINK})`,
  version: "2.0.9",
  annotations: {
    destructiveHint: true,
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
    const params: DeleteTweetParams = {
      $,
      tweetId,
      fallbackError: ACTION_ERROR_MESSAGE,
    };

    const response = await this.app.deleteTweet(params);

    $.export("$summary", `Successfully deleted tweet (ID ${tweetId})`);

    return response;
  },
});
