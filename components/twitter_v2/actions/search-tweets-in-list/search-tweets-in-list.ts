import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import {
  getMultiItemSummary, getTweetFields,
} from "../../common/methods";
import { tweetFieldProps } from "../../common/propGroups";
import { GetListTweetsParams } from "../../common/types/requestParams";
import {
  PaginatedResponseObject, Tweet,
} from "../../common/types/responseSchemas";

export const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/lists/list-tweets/api-reference/get-lists-id-tweets";
const MIN_RESULTS = 1;
const DEFAULT_RESULTS = 100;
export const MAX_RESULTS_PER_PAGE = 100;

export default defineAction({
  key: "twitter_v2-search-tweets-in-list",
  name: "Search Tweets",
  description: `Search Tweets by text in a list. [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
  type: "action",
  props: {
    app,
    listId: {
      propDefinition: [
        app,
        "listId",
      ],
    },
    searchTerms: {
      label: "Search Term(s)",
      type: "string[]",
      description: "Text to filter tweets by. If you include more than one item in this array, only tweets that match all items will be returned. You can use the pipe character `|` to define multiple strings within an item, and it will be considered a match if the tweet contains any of them.",
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
    const {
      listId, searchTerms,
    } = this;
    const params: GetListTweetsParams = {
      $,
      listId,
      maxPerPage: MAX_RESULTS_PER_PAGE,
      maxResults: this.maxResults,
      params: this.getTweetFields(),
    };

    const response = await this.app.getListTweets(params);
    const { data } = response;
    const filteredTweets = data.filter(({ text }) => searchTerms.every((term) => term.split("|").some((splitTerm) => text.includes(splitTerm))));

    $.export("$summary", this.getMultiItemSummary("tweet", filteredTweets.length));

    return {
      data: filteredTweets,
    };
  },
});
