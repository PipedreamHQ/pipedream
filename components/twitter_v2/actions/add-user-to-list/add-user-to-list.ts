import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import { getUserId } from "../../common/methods";
import { AddUserToListParams } from "../../common/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/lists/list-members/api-reference/post-lists-id-members";

export default defineAction({
  key: "twitter_v2-add-user-to-list",
  name: "Add User To List",
  description: `Add a member to a list owned by the user. [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
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
    const userId = await this.getUserId();
    if (!userId) throw new Error("User not found");

    const params: AddUserToListParams = {
      $,
      listId: this.listId,
      data: {
        user_id: userId,
      },
    };

    const response = await this.app.addUserToList(params);

    $.export("$summary", "Successfully added user to list");

    return response;
  },
});
