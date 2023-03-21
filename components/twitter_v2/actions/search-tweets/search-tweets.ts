import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import { getTweetFields } from "../../common/methods";
import { tweetFieldProps } from "../../common/propGroups";
import { SearchTweetsParams } from "../../common/types/requestParams";
import { Tweet } from "../../common/types/responseSchemas";

export const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-recent";
const MIN_RESULTS = 10;
const DEFAULT_RESULTS = 10;
export const MAX_RESULTS_PER_PAGE = 100;

export default defineAction({
  key: "twitter_v2-search-tweets",
  name: "Search Tweets",
  description: `Retrieve Tweets from the last seven days that match a query. [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
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
    getTweetFields,
  },
  async run({ $ }): Promise<Tweet[]> {
    const params: SearchTweetsParams = {
      $,
      maxPerPage: MAX_RESULTS_PER_PAGE,
      maxResults: this.maxResults,
      params: {
        query: this.query,
      },
    };

    const response = await this.app.searchTweets(params);
    const { length } = response;

    const summary = length
      ? `Successfully retrieved ${length} tweet${length === 1
        ? ""
        : "s"}`
      : "No tweets found";
    $.export("$summary", summary);

    return response;
  },
});
