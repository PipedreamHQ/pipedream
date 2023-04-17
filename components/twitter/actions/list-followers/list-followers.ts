import app from "../../app/twitter.app";
import { defineAction } from "@pipedream/types";
import {
  getMultiItemSummary, getUserId, getUserFields,
} from "../../common/methods";
import { GetUserFollowersParams } from "../../common/types/requestParams";
import { userFieldProps } from "../../common/propGroups";
import {
  PaginatedResponseObject, User,
} from "../../common/types/responseSchemas";

export const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/get-users-id-followers";
const MIN_RESULTS = 1;
const DEFAULT_RESULTS = 100;
export const MAX_RESULTS_PER_PAGE = 1000;

export default defineAction({
  key: "twitter-list-followers",
  name: "List Followers",
  description: `Return a collection of user objects for users following the specified user. [See docs here](${DOCS_LINK})`,
  version: "1.0.0",
  type: "action",
  props: {
    app,
    userNameOrId: {
      propDefinition: [
        app,
        "userNameOrId",
      ],
    },
    ...userFieldProps,
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
      min: MIN_RESULTS,
      max: MAX_RESULTS_PER_PAGE * 5,
      default: DEFAULT_RESULTS,
    },
  },
  methods: {
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
    };

    const response = await this.app.getUserFollowers(params);

    $.export("$summary", this.getMultiItemSummary("follower", response.data?.length));

    return response;
  },
});
