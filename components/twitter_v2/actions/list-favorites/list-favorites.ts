import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import {
  getUserId, getTweetFields,
} from "../../common/methods";
import { tweetFieldProps } from "../../common/propGroups";
import { GetLikedTweetParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/likes/api-reference/get-users-id-liked_tweets";
const MIN_RESULTS = 10;
const DEFAULT_RESULTS = 100;
const MAX_RESULTS_PER_PAGE = 100;

export default defineAction({
  key: "twitter_v2-list-favorites",
  name: "List Liked Tweets",
  description: `Return the most recent tweets liked by you or the specified user. [See docs here](${DOCS_LINK})`,
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
    getUserId,
    getTweetFields,
  },
  async run({ $ }): Promise<object> {
    const userId = await this.getUserId();

    const params: GetLikedTweetParams = {
      $,
      userId,
      params: this.getTweetFields(),
      maxPerPage: MAX_RESULTS_PER_PAGE,
      maxResults: this.maxResults,
    };

    const response = await this.app.getLikedTweets(params);

    $.export("$summary", `Successfully obtained ${response.length} liked tweets`);

    return response;
  },
});
