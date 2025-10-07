import common from "../../common/appValidation";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import { GetTweetParams } from "../../common/types/requestParams";
import { getTweetFields } from "../../common/methods";
import {
  ResponseObject, Tweet,
} from "../../common/types/responseSchemas";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/api-reference/get-tweets-id";

export default defineAction({
  ...common,
  key: "twitter-get-tweet",
  name: "Get Tweet",
  description: `Return a single tweet specified by ID. [See the documentation](${DOCS_LINK})`,
  version: "2.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  methods: {
    ...common.methods,
    getTweetFields,
  },
  async run({ $ }): Promise<ResponseObject<Tweet>> {
    const { tweetId } = this;
    const params: GetTweetParams = {
      $,
      params: this.getTweetFields(),
      tweetId,
      fallbackError: ACTION_ERROR_MESSAGE,
    };

    const response = await this.app.getTweet(params);

    $.export("$summary", `Successfully retrieved tweet (ID ${tweetId})`);

    return response;
  },
});
