import app from "../../app/twitter.app";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import { getUserId } from "../../common/methods";
import { AddUserToListParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/lists/list-members/api-reference/post-lists-id-members";

export default defineAction({
  key: "twitter-add-user-to-list",
  name: "Add User To List",
  description: `Add a member to a list owned by the user. [See the documentation](${DOCS_LINK})`,
  version: "2.0.3",
  type: "action",
  props: {
    app,
    listId: {
      propDefinition: [
        app,
        "listId",
      ],
    },
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

      const params: AddUserToListParams = {
        $,
        data: {
          user_id: userId,
        },
        listId: this.listId,
      };

      const response = await this.app.addUserToList(params);

      $.export(
        "$summary",
        response.data?.is_member !== true
          ? "User not added to list"
          : "Successfully added user to list",
      );

      return response;
    } catch (err) {
      $.export("error", err);
      throw new Error(ACTION_ERROR_MESSAGE);
    }
  },
});
