import app, { GLOBAL_ERROR_MESSAGE } from "../../app/twitter.app";
import { defineAction } from "@pipedream/types";
import { getUserId } from "../../common/methods";
import { UnfollowUserParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/delete-users-source_id-following";

export default defineAction({
  key: "twitter-unfollow-user",
  name: "Unfollow User",
  description: `Unfollow a user. [See docs here](${DOCS_LINK})`,
  version: "1.0.4",
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
    try {
      const userId = await this.getUserId();

      const params: UnfollowUserParams = {
        $,
        userId,
      };

      const response = await this.app.unfollowUser(params);

      $.export("$summary", "Successfully unfollowed user");

      return response;
    } catch (err) {
      $.export("error", err);
      throw new Error(GLOBAL_ERROR_MESSAGE);
    }
  },
});
