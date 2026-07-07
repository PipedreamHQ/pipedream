import app from "../../linkupapi.app.mjs";
import { ACTIONS } from "../../common/constants.mjs";

export default {
  type: "action",
  key: "linkupapi-get-invitations-status",
  name: "Get Invitations Status",
  description: "List pending connection invitations **received** by the connected account. Note: this returns invitations received, not ones you have sent. [See the documentation](https://docs.linkupapi.com/api-reference/v2/network/list-invitations)",
  version: "0.0.2",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.network({
      $,
      data: {
        account_id: this.accountId,
        action: ACTIONS.LIST_INVITATIONS,
        params: {},
      },
    });

    $.export("$summary", "Successfully retrieved invitation status");
    return response;
  },
};
