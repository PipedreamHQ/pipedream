import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import {
  getUserId, getTweetFields,
} from "../../common/methods";
import {
  paginationProps, tweetFieldProps,
} from "../../common/propGroups";
import { GetUserTweetsParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-tweets";

export default defineAction({
  key: "twitter_v2-list-user-tweets",
  name: "List User Tweets",
  description: `Return a collection of the most recent tweets posted by a user. [See docs here](${DOCS_LINK})`,
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
    ...paginationProps,
  },
  methods: {
    getUserId,
    getTweetFields,
  },
  async run({ $ }): Promise<object> {
    const userId = await this.getUserId();

    const params: GetUserTweetsParams = {
      $,
      userId,
      params: this.getTweetFields(),
    };

    const response = await this.app.getUserTweets(params);

    $.export("$summary", `Successfully retrieved ${response.length ?? ""} mentions`);

    return response;
  },
});
