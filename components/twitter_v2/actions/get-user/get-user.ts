import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import { getUserId } from "../../common/methods";
import { GetUserParams } from "../../common/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-id";

export default defineAction({
  key: "twitter_v2-get-user",
  name: "Get User",
  description: `Get information about a user. [See docs here](${DOCS_LINK})`,
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
    expansions: {
      propDefinition: [
        app,
        "userExpansions",
      ],
    },
    tweetFields: {
      propDefinition: [
        app,
        "tweetFields",
      ],
      description:
        "Specific [tweet fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/tweet) to be included in the returned pinned Tweet. Only applicable if the user has a pinned Tweet and you've requested the `referenced_tweets.id` expansion.",
    },
    userFields: {
      propDefinition: [
        app,
        "userFields",
      ],
      description:
        "Specific [user fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/user) to be included in the returned user object.",
    },
  },
  methods: {
    getUserId,
  },
  async run({ $ }): Promise<object> {
    const userId = await this.getUserId();

    const params: GetUserParams = {
      $,
      userId,
      params: {
        "expansions": this.expansions?.join(),
        "tweet.fields": this.tweetFields?.join(),
        "user.fields": this.userFields?.join(),
      },
    };

    const response = await this.app.getUser(params);

    $.export("$summary", "Successfully retrieved user");

    return response;
  },
});
