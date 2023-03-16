import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import {
  getUserId,
  getTweetFields,
} from "../../common/methods";
import { tweetFieldProps } from "../../common/propGroups";
import { GetUserMentionsParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-mentions";

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
    };

    const response = await this.app.getUserMentions(params);

    $.export("$summary", `Successfully retrieved ${response.length ?? ""} mentions`);

    return response;
  },
});
