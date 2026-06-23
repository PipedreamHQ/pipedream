import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-workspace-id-options",
  name: "List Workspace Options",
  description: "Retrieves available options for the Workspace field using token-based pagination."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/workspaces/list-workspaces)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartsheet,
  },
  async run({ $ }) {
    const { data } = await this.smartsheet.listAllWorkspaces({
      $,
    });
    const options = (data || []).map(({
      id, name,
    }) => ({
      label: name,
      value: id,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} workspace${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
