import common from "../../common/appValidation";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import {
  getMultiItemSummary,
  getUserId,
  getTweetFields,
} from "../../common/methods";
import { GetUserMentionsParams } from "../../common/types/requestParams";
import {
  PaginatedResponseObject,
  Tweet,
} from "../../common/types/responseSchemas";

export const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-mentions";
const MIN_RESULTS = 5;
const DEFAULT_RESULTS = 10;
export const MAX_RESULTS_PER_PAGE = 100;

export default defineAction({
  ...common,
  key: "twitter-list-mentions",
  name: "List Mentions",
  description: `Return the most recent mentions for the specified user. [See the documentation](${DOCS_LINK})`,
  version: "2.0.10",
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

    const params: GetUserMentionsParams = {
      $,
      maxPerPage: MAX_RESULTS_PER_PAGE,
      maxResults: this.maxResults,
      params: this.getTweetFields(),
      userId,
      fallbackError: ACTION_ERROR_MESSAGE,
    };

    const response = await this.app.getUserMentions(params);
    $.export(
      "$summary",
      this.getMultiItemSummary("mention", response.data?.length),
    );

    return response;
  },
});
