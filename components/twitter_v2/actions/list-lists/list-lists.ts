import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import {
  getUserId, getListFields,
} from "../../common/methods";
import { listFieldProps } from "../../common/propGroups";
import { GetOwnedListsParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/lists/list-lookup/api-reference/get-users-id-owned_lists";
const MIN_RESULTS = 1;
const DEFAULT_RESULTS = 100;
const MAX_RESULTS_PER_PAGE = 100;

export default defineAction({
  key: "twitter_v2-list-lists",
  name: "List Lists",
  description: `Get all lists owned by a user. [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
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
    getUserId,
    getListFields,
  },
  async run({ $ }): Promise<object> {
    const userId = await this.getUserId();

    const params: GetOwnedListsParams = {
      $,
      userId,
      params: this.getListFields(),
      maxPerPage: MAX_RESULTS_PER_PAGE,
      maxResults: this.maxResults,
    };

    const response = await this.app.getOwnedLists(params);

    $.export("$summary", `Successfully obtained ${response.length} lists`);

    return response;
  },
});
