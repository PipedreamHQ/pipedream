import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import { getUserId } from "../../common/methods";
import { GetUserParams } from "../../common/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-id";

export default defineAction({
  key: "twitter_v2-get-user",
  name: "Get User",
  description: `Get information about a user. [See docs here](${DOCS_LINK})`,
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
  async run({ $ }): Promise<boolean> {
    const userId = await this.getUserId();
    if (!userId) throw new Error("User not found");

    const params: GetUserParams = {
      $,
      userId,
    };

    const response = await this.app.getUser(params);

    $.export(
      "$summary",
      "Successfully retrieved user",
    );

    return response;
  },
});
