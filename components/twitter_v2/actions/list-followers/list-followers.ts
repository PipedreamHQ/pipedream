import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import { getUserId } from "../../common/methods";
import {
  ListFollowersParams,
} from "../../common/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/get-users-id-followers";

export default defineAction({
  key: "twitter_v2-list-followers",
  name: "List Followers",
  description: `Return a collection of user objects for users following the specified user. [See docs here](${DOCS_LINK})`,
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

    const params: ListFollowersParams = {
      $,
      userId,
    };

    const response = await this.app.listFollowers(params);

    $.export(
      "$summary",
      "Successfully retrieved followers",
    );

    return response;
  },
});
