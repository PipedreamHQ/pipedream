import app from "../../app/twitter.app";
import { defineAction } from "@pipedream/types";
import {
  getMultiItemSummary, getTweetFields,
} from "../../common/methods";
import { tweetFieldProps } from "../../common/propGroups";
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
  version: "1.0.0",
  type: "action",
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    ...tweetFieldProps,
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
    getTweetFields,
  },
  async run({ $ }): Promise<PaginatedResponseObject<Tweet>> {
    const params: SearchTweetsParams = {
      $,
      maxPerPage: MAX_RESULTS_PER_PAGE,
      maxResults: this.maxResults,
      params: {
        query: this.query,
      },
    };

    const response = await this.app.searchTweets(params);

    $.export("$summary", this.getMultiItemSummary("tweet", response.data?.length));

    return response;
  },
});
