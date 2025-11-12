import app from "../../blazemeter.app.mjs";

export default {
  key: "blazemeter-list-projects",
  name: "List Projects",
  description: "List projects from a specified workspace in BlazeMeter. [See the documentation](https://api.blazemeter.com/functional/#projects-list)",
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
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listProjects({
      $,
      params: {
        workspaceId: this.workspaceId,
      },
    });

    $.export("$summary", `Successfully listed ${response.result.length} projects in the workspace`);

    return response;
  },
};
