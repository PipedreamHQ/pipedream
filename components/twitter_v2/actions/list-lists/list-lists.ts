import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import {
  getUserId, getListFields,
} from "../../common/methods";
import { listFieldProps } from "../../common/fieldProps";
import { GetOwnedListsParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/lists/list-lookup/api-reference/get-users-id-owned_lists";

export default defineAction({
  key: "twitter_v2-list-lists",
  name: "List Lists",
  description: `Get all lists owned by a user. [See docs here](${DOCS_LINK})`,
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
    ...listFieldProps,
  },
  methods: {
    getUserId,
    getListFields,
  },
  async run({ $ }): Promise<object> {
    const userId = await this.getUserId();

    const params: GetOwnedListsParams = {
      $,
      userId,
      params: this.getListFields(),
    };

    const response = await this.app.getOwnedLists(params);

    $.export("$summary", `Successfully obtained ${response.length ?? ""} lists`);

    return response;
  },
});
