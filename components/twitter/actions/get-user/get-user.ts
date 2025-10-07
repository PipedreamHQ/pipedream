import common from "../../common/appValidation";
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
  ...common,
  key: "twitter-get-user",
  name: "Get User",
  description: `Get information about a user. [See the documentation](${DOCS_LINK})`,
  version: "2.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    getUserFields,
  },
  async run({ $ }): Promise<ResponseObject<User>> {
    let response: ResponseObject<User>;
    const params = {
      $,
      params: this.getUserFields(),
      fallbackError: ACTION_ERROR_MESSAGE,
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
  },
});
