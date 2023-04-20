import app from "../../app/twitter.app";
import { defineAction } from "@pipedream/types";
import {
  getMultiItemSummary, getTweetFields,
} from "../../common/methods";
import { SearchTweetsParams } from "../../common/types/requestParams";
import {
  PaginatedResponseObject, Tweet,
} from "../../common/types/responseSchemas";

export const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-recent";
const MIN_RESULTS = 10;
const DEFAULT_RESULTS = 10;
export const MAX_RESULTS_PER_PAGE = 100;

export default defineAction({
  key: "twitter-simple-search",
  name: "Search Tweets",
  description: `Retrieve Tweets from the last seven days that match a query. [See docs here](${DOCS_LINK})`,
  version: "1.1.2",
  type: "action",
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
      min: MIN_RESULTS,
      description: `Maximum amount of items to return. Each request can return up to ${MAX_RESULTS_PER_PAGE} items.`,
      default: DEFAULT_RESULTS,
    },
  },
  methods: {
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
    };

    const response = await this.app.searchTweets(params);

    $.export("$summary", this.getMultiItemSummary("tweet", response.data?.length));

    return response;
  },
});
