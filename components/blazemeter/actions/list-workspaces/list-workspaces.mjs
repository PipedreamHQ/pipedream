import app from "../../blazemeter.app.mjs";

export default {
  key: "blazemeter-list-workspaces",
  name: "List Workspaces",
  description: "List all workspaces associated with the specified account. [See the documentation](https://api.blazemeter.com/functional/#workspaces-list)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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
    const response = await this.app.listWorkspaces({
      $,
      params: {
        accountId: this.accountId,
      },
    });

    $.export("$summary", `Successfully listed ${response.result.length} workspace(s)`);

    return response;
  },
};
