import common from "../../common/appValidation";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import {
  getMultiItemSummary,
  getUserId,
  getTweetFields,
} from "../../common/methods";
import { GetUserLikedTweetParams } from "../../common/types/requestParams";
import {
  PaginatedResponseObject,
  Tweet,
} from "../../common/types/responseSchemas";

export const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/likes/api-reference/get-users-id-liked_tweets";
const MIN_RESULTS = 10;
const DEFAULT_RESULTS = 100;
export const MAX_RESULTS_PER_PAGE = 100;

export default defineAction({
  ...common,
  key: "twitter-list-favorites",
  name: "List Liked Tweets",
  description: `Return the most recent tweets liked by you or the specified user. [See the documentation](${DOCS_LINK})`,
  version: "2.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    userNameOrId: {
      propDefinition: [
        common.props.app,
        "userNameOrId",
      ],
    },
    maxResults: {
      propDefinition: [
        common.props.app,
        "maxResults",
      ],
      min: MIN_RESULTS,
      description: `Maximum amount of items to return. Each request can return up to ${MAX_RESULTS_PER_PAGE} items.`,
      default: DEFAULT_RESULTS,
    },
  },
  methods: {
    ...common.methods,
    getMultiItemSummary,
    getUserId,
    getTweetFields,
  },
  async run({ $ }): Promise<PaginatedResponseObject<Tweet>> {
    const userId = await this.getUserId();

    const params: GetUserLikedTweetParams = {
      $,
      maxPerPage: MAX_RESULTS_PER_PAGE,
      maxResults: this.maxResults,
      params: this.getTweetFields(),
      userId,
      fallbackError: ACTION_ERROR_MESSAGE,
    };

    const response = await this.app.getUserLikedTweets(params);

    $.export(
      "$summary",
      this.getMultiItemSummary("liked tweet", response.data?.length),
    );

    return response;
  },
});
