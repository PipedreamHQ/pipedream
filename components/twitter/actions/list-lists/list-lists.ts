import app from "../../app/twitter.app";
import { defineAction } from "@pipedream/types";
import {
  getMultiItemSummary, getUserId, getListFields,
} from "../../common/methods";
import { listFieldProps } from "../../common/propGroups";
import { GetUserOwnedListsParams } from "../../common/types/requestParams";
import {
  List, PaginatedResponseObject,
} from "../../common/types/responseSchemas";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/lists/list-lookup/api-reference/get-users-id-owned_lists";
const MIN_RESULTS = 1;
const DEFAULT_RESULTS = 100;
const MAX_RESULTS_PER_PAGE = 100;

export default defineAction({
  key: "twitter-list-lists",
  name: "List Lists",
  description: `Get all lists owned by a user. [See docs here](${DOCS_LINK})`,
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
    ...listFieldProps,
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
    getListFields,
  },
  async run({ $ }): Promise<PaginatedResponseObject<List>> {
    const userId = await this.getUserId();

    const params: GetUserOwnedListsParams = {
      $,
      maxPerPage: MAX_RESULTS_PER_PAGE,
      maxResults: this.maxResults,
      params: this.getListFields(),
      userId,
    };

    const response = await this.app.getUserOwnedLists(params);

    $.export("$summary", this.getMultiItemSummary("list", response.data?.length));

    return response;
  },
});
