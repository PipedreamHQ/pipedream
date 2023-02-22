import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/lists/list-members/api-reference/post-lists-id-members";

export default defineAction({
  name: "Add User To List",
  description: `Add a member to a list owned by the user. [See docs here](${DOCS_LINK})`,
  key: "twitter-add-user-to-list",
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
    async getUserId(): Promise<string> {
      const { userNameOrId } = this;
      return userNameOrId.startsWith("@")
        ? this.app.getUserByUsername(userNameOrId.slice(1))
        : userNameOrId;
    },
  },
  async run({ $ }): Promise<boolean> {
    const userId = await this.getUserId();
    if (!userId) throw new Error("User not found");

    const params = {
      $,
      listId: this.listId,
      data: {
        userId,
      },
    };

    const response = await this.app.addUserToList(params);

    $.export("$summary", "Successfully added user to list");

    return response;
  },
});
