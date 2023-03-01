import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import { getUserId } from "../../common/methods";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/likes/api-reference/get-users-id-liked_tweets";

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
  },
  methods: {
    getUserId,
  },
  async run({ $ }): Promise<object> {
    const userId = await this.getUserId();
    if (!userId) throw new Error("User not found");

    const params = {
      $,
      userId,
    };

    const response = await this.app.getLikedTweets(params);

    $.export("$summary", `Successfully obtained ${response.length ?? ""} liked tweets`);

    return response;
  },
});
