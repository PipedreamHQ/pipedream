import common from "../../common/appValidation";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import {
  getMultiItemSummary,
  getUserId,
  getListFields,
} from "../../common/methods";
import { GetUserOwnedListsParams } from "../../common/types/requestParams";
import {
  List,
  PaginatedResponseObject,
} from "../../common/types/responseSchemas";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/lists/list-lookup/api-reference/get-users-id-owned_lists";
const MIN_RESULTS = 1;
const DEFAULT_RESULTS = 100;
const MAX_RESULTS_PER_PAGE = 100;

export default defineAction({
  ...common,
  key: "twitter-list-lists",
  name: "List Lists",
  description: `Get all lists owned by a user. [See the documentation](${DOCS_LINK})`,
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
      fallbackError: ACTION_ERROR_MESSAGE,
    };

    const response = await this.app.getUserOwnedLists(params);

    $.export(
      "$summary",
      this.getMultiItemSummary("list", response.data?.length),
    );

    return response;
  },
});
