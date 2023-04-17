import app from "../../app/twitter.app";
import { defineAction } from "@pipedream/types";
import {
  getUserId, getUserFields,
} from "../../common/methods";
import { GetUserParams } from "../../common/types/requestParams";
import { includeAllFields, userAdditionalProps as additionalProps } from "../../common/propGroups";
import {
  ResponseObject, User,
} from "../../common/types/responseSchemas";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-id";

export default defineAction({
  key: "twitter-get-user",
  name: "Get User",
  description: `Get information about a user. [See docs here](${DOCS_LINK})`,
  version: "1.0.0",
  type: "action",
  props: {
    app,
    userNameOrId: {
      propDefinition: [
        app,
        "userNameOrId",
      ],
    },
    includeAllFields
  },
  additionalProps,
  methods: {
    getUserId,
    getUserFields,
  },
  async run({ $ }): Promise<ResponseObject<User>> {
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
