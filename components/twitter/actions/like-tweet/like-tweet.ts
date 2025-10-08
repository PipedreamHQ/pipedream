import common from "../../common/appValidation";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import { LikeTweetParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/likes/api-reference/post-users-id-likes";

export default defineAction({
  ...common,
  key: "twitter-like-tweet",
  name: "Like Tweet",
  description: `Like a tweet specified by its ID. [See the documentation](${DOCS_LINK})`,
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
    const params: LikeTweetParams = {
      $,
      data: {
        tweet_id: tweetId,
      },
      fallbackError: ACTION_ERROR_MESSAGE,
    };

    const response = await this.app.likeTweet(params);

    $.export("$summary", `Successfully liked tweet (ID ${tweetId})`);

    return response;
  },
});
