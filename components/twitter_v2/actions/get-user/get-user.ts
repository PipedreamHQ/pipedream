import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import {
  getUserId, getUserFields,
} from "../../common/methods";
import { GetUserParams } from "../../common/types/requestParams";
import { userFieldProps } from "../../common/propGroups";

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
    ...userFieldProps,
  },
  methods: {
    getUserId,
    getUserFields,
  },
  async run({ $ }): Promise<object> {
    const userId = await this.getUserId();

    const params: GetUserParams = {
      $,
      params: this.getUserFields(),
      userId,
    };

    const response = await this.app.getUser(params);

    $.export("$summary", "Successfully retrieved user");

    return response;
  },
});
