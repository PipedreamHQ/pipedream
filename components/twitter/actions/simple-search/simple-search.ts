import common from "../../common/appValidation";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import {
  getMultiItemSummary, getTweetFields,
} from "../../common/methods";
import { SearchTweetsParams } from "../../common/types/requestParams";
import {
  PaginatedResponseObject,
  Tweet,
} from "../../common/types/responseSchemas";

export const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-recent";
const MIN_RESULTS = 10;
const DEFAULT_RESULTS = 10;
export const MAX_RESULTS_PER_PAGE = 100;

export default defineAction({
  ...common,
  key: "twitter-simple-search",
  name: "Search Tweets",
  description: `Retrieve Tweets from the last seven days that match a query. [See the documentation](${DOCS_LINK})`,
  version: "2.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    query: {
      propDefinition: [
        common.props.app,
        "query",
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
    getTweetFields,
  },
  async run({ $ }): Promise<PaginatedResponseObject<Tweet>> {
    const params: SearchTweetsParams = {
      $,
      maxPerPage: MAX_RESULTS_PER_PAGE,
      maxResults: this.maxResults,
      params: {
        query: this.query,
        ...this.getTweetFields(),
      },
      fallbackError: ACTION_ERROR_MESSAGE,
    };

    const response = await this.app.searchTweets(params);

    $.export(
      "$summary",
      this.getMultiItemSummary("tweet", response.data?.length),
    );

    return response;
  },
});
