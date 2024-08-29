import common from "../common/workspace-prop.mjs";

export default {
  ...common,
  key: "clickup-stop-time-entry",
  name: "Stop Time Entry",
  description: "Stop time entry. [See documentation here](https://clickup.com/api/clickupreference/operation/StopatimeEntry)",
  version: "0.0.4",
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
