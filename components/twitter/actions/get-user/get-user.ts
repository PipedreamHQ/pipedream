import app from "../../app/twitter.app";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import {
  getUserId, getUserFields,
} from "../../common/methods";
import { GetUserParams } from "../../common/types/requestParams";
import {
  ResponseObject, User,
} from "../../common/types/responseSchemas";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-id";

export default defineAction({
  key: "twitter-get-user",
  name: "Get User",
  description: `Get information about a user. [See the documentation](${DOCS_LINK})`,
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
    getUserFields,
  },
  async run({ $ }): Promise<ResponseObject<User>> {
    try {
      let response: ResponseObject<User>;
      const params = {
        $,
        params: this.getUserFields(),
      };
      if (this.userNameOrId === "me") {
        response = await this.app.getAuthenticatedUser(params);
      } else {
        (params as GetUserParams).userId = await this.getUserId();
        response = await this.app.getUser(params);
      }

      $.export(
        "$summary",
        `Successfully retrieved user "${(response.data as User)?.username}"`,
      );

      return response;
    } catch (err) {
      $.export("error", err);
      throw new Error(ACTION_ERROR_MESSAGE);
    }
  },
});
