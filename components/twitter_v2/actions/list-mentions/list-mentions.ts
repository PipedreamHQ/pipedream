import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import {
  getUserId,
  getTweetFields,
} from "../../common/methods";
import {
  tweetFieldProps,
} from "../../common/propGroups";
import { GetUserMentionsParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-mentions";
  const MIN_RESULTS = 5;
  const DEFAULT_RESULTS = 10;
  const MAX_RESULTS_PER_PAGE = 100;

export default defineAction({
  key: "twitter_v2-list-mentions",
  name: "List Mentions",
  description: `Return the 10 most recent mentions for the authenticated user. [See docs here](${DOCS_LINK})`,
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

    const params: GetUserMentionsParams = {
      $,
      userId,
      params: this.getTweetFields(),
      maxPerPage: MAX_RESULTS_PER_PAGE,
      maxResults: this.maxResults,
    };

    const response = await this.app.getUserMentions(params);

    $.export("$summary", `Successfully retrieved ${response.length ?? ""} mentions`);

    return response;
  },
});
