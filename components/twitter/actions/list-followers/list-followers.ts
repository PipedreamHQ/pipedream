import common from "../../common/appValidation";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import {
  getMultiItemSummary,
  getUserId,
  getUserFields,
} from "../../common/methods";
import { GetUserFollowersParams } from "../../common/types/requestParams";
import {
  PaginatedResponseObject,
  User,
} from "../../common/types/responseSchemas";

export const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/get-users-id-followers";
const MIN_RESULTS = 1;
const DEFAULT_RESULTS = 100;
export const MAX_RESULTS_PER_PAGE = 1000;

export default defineAction({
  ...common,
  key: "twitter-list-followers",
  name: "List Followers",
  description: `Return a collection of user objects for users following the specified user. [See the documentation](${DOCS_LINK})`,
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
    getUserFields,
  },
  async run({ $ }): Promise<PaginatedResponseObject<User>> {
    const userId = await this.getUserId();

    const params: GetUserFollowersParams = {
      $,
      maxPerPage: MAX_RESULTS_PER_PAGE,
      maxResults: this.maxResults,
      params: this.getUserFields(),
      userId,
      fallbackError: ACTION_ERROR_MESSAGE,
    };

    const response = await this.app.getUserFollowers(params);

    $.export(
      "$summary",
      this.getMultiItemSummary("follower", response.data?.length),
    );

    return response;
  },
});
