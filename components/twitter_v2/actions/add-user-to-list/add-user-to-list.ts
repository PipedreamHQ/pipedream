import app from "../../app/twitter.app";
import { defineAction } from "@pipedream/types";

const DOCS_LINK = "https://developer.twitter.com/en/docs/twitter-api/lists/list-members/api-reference/post-lists-id-members";

export default defineAction({
  name: "Create Subscription",
  description: `Add a member to a list owned by the user. [See docs here](${DOCS_LINK})`,
  key: "twitter-add-user-to-list",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    listId: {
      propDefinition: [
        app,
        "listId"
      ]
    },
    userId: {
      propDefinition: [
        app,
        "userId"
      ]
    }
  },
  async run({ $ }): Promise<object> {
    const params = {
      $,
      data: {
      },
    };
    const response = await this.app.addUserToList(params);

    $.export("$summary", 'Successfully added user to list');

    return response;
  },
})