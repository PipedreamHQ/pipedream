import common from "../../common/appValidation";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import { getUserId } from "../../common/methods";
import { AddUserToListParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/lists/list-members/api-reference/post-lists-id-members";

export default defineAction({
  ...common,
  key: "twitter-add-user-to-list",
  name: "Add User To List",
  description: `Add a member to a list owned by the user. [See the documentation](${DOCS_LINK})`,
  version: "2.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.app,
        "listId",
      ],
    },
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

    const params: AddUserToListParams = {
      $,
      data: {
        user_id: userId,
      },
      listId: this.listId,
      fallbackError: ACTION_ERROR_MESSAGE,
    };

    const response = await this.app.addUserToList(params);

    $.export(
      "$summary",
      response.data?.is_member !== true
        ? "User not added to list"
        : "Successfully added user to list",
    );

    return response;
  },
});
