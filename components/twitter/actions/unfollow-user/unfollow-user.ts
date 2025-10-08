import common from "../../common/appValidation";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import { getUserId } from "../../common/methods";
import { UnfollowUserParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/delete-users-source_id-following";

export default defineAction({
  ...common,
  key: "twitter-unfollow-user",
  name: "Unfollow User",
  description: `Unfollow a user. [See the documentation](${DOCS_LINK})`,
  version: "2.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    userNameOrId: {
      propDefinition: [
        common.props.app,
        "userNameOrId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getUserId,
  },
  async run({ $ }): Promise<object> {
    const userId = await this.getUserId();

    const params: UnfollowUserParams = {
      $,
      userId,
      fallbackError: ACTION_ERROR_MESSAGE,
    };

    const response = await this.app.unfollowUser(params);

    $.export("$summary", "Successfully unfollowed user");

    return response;
  },
});
