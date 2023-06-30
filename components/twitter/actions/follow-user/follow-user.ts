import app from "../../app/twitter.app";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import { getUserId } from "../../common/methods";
import { FollowUserParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/post-users-source_user_id-following";

export default defineAction({
  key: "twitter-follow-user",
  name: "Follow User",
  description: `Follow a user. [See the documentation](${DOCS_LINK})`,
  version: "2.0.3",
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

      const params: FollowUserParams = {
        $,
        data: {
          target_user_id: userId,
        },
      };

      const response = await this.app.followUser(params);

      $.export(
        "$summary",
        `Successfully ${response.data?.following
          ? "followed"
          : "requested to follow"
        } user`,
      );

      return response;
    } catch (err) {
      $.export("error", err);
      throw new Error(ACTION_ERROR_MESSAGE);
    }
  },
});
