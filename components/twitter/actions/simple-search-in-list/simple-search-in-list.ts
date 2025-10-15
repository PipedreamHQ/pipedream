import common from "../../common/appValidation";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import {
  getMultiItemSummary, getTweetFields,
} from "../../common/methods";
import { GetListTweetsParams } from "../../common/types/requestParams";
import {
  PaginatedResponseObject,
  Tweet,
} from "../../common/types/responseSchemas";

export const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/lists/list-tweets/api-reference/get-lists-id-tweets";
const MIN_RESULTS = 1;
const DEFAULT_RESULTS = 100;
export const MAX_RESULTS_PER_PAGE = 100;

export default defineAction({
  ...common,
  key: "twitter-simple-search-in-list",
  name: "Search Tweets in List",
  description: `Search Tweets by text in a list. [See the documentation](${DOCS_LINK})`,
  version: "2.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.app,
        "listId",
      ],
    },
    searchTerms: {
      label: "Search Term(s)",
      type: "string[]",
      description:
        "Text to filter tweets by. If you include more than one item in this array, only tweets that match all items will be returned. You can use the pipe character `|` to define multiple strings within an item, and it will be considered a match if the tweet contains any of them.",
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
    const {
      listId, searchTerms,
    } = this;
    const params: GetListTweetsParams = {
      $,
      listId,
      maxPerPage: MAX_RESULTS_PER_PAGE,
      maxResults: this.maxResults,
      params: this.getTweetFields(),
      fallbackError: ACTION_ERROR_MESSAGE,
    };

    const response = await this.app.getListTweets(params);
    const { data } = response;
    const filteredTweets = data.filter(({ text }) =>
      searchTerms.every((term) =>
        term.split("|").some((splitTerm) => text.includes(splitTerm))));

    $.export(
      "$summary",
      this.getMultiItemSummary("tweet", filteredTweets.length),
    );

    return {
      data: filteredTweets,
    };
  },
});
