import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import {
  getUserId, getUserFields,
} from "../../common/methods";
import { ListFollowersParams } from "../../common/requestParams";
import userFieldProps from "../../common/userFieldProps";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/get-users-id-followers";

export default defineAction({
  key: "twitter_v2-list-followers",
  name: "List Followers",
  description: `Return a collection of user objects for users following the specified user. [See docs here](${DOCS_LINK})`,
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

    const params: ListFollowersParams = {
      $,
      userId,
      params: this.getUserFields(),
    };

    const response = await this.app.listFollowers(params);

    $.export(
      "$summary",
      "Successfully retrieved followers",
    );

    return response;
  },
});
