import common from "../common/workspace-prop.mjs";

export default {
  ...common,
  key: "clickup-stop-time-entry",
  name: "Stop Time Entry",
  description: "Stop time entry. [See the documentation](https://clickup.com/api/clickupreference/operation/StopatimeEntry)",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  async run({ $ }) {
    const response = await this.clickup.stopTimeEntry({
      $,
      teamId: this.workspaceId,
    });

    $.export("$summary", "Successfully stopped time entry");

    return response;
  },
};
