import common from "../../common/appValidation";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import { RetweetParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/retweets/api-reference/post-users-id-retweets";

export default defineAction({
  ...common,
  key: "twitter-retweet",
  name: "Retweet a tweet",
  description: `Retweet a tweet specified by ID. [See the documentation](${DOCS_LINK})`,
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
      description: "The ID of the tweet you'd like to retweet",
    },
  },
  async run({ $ }): Promise<object> {
    const { tweetId } = this;
    const params: RetweetParams = {
      $,
      data: {
        tweet_id: tweetId,
      },
      fallbackError: ACTION_ERROR_MESSAGE,
    };

    const response = await this.app.retweet(params);

    $.export(
      "$summary",
      response.data?.retweeted !== true
        ? "Retweet failed"
        : "Tweet successfully retweeted",
    );

    return response;
  },
});
