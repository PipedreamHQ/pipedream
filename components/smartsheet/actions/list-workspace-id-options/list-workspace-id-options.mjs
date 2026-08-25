// x-pd-ai: optimized
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-workspace-id-options",
  name: "List Workspace Options",
  description: "Retrieves `{ label, value }` pairs for populating a Workspace dropdown, following token-based pagination to the end."
    + " This is a form helper, not a Smartsheet capability: it returns only workspace names and IDs."
    + " Use the workspace IDs it returns with **Create Sheet**, **Import Sheet**, **Copy Sheet**, **Move Sheet**,"
    + " or with **List Folder Options** to drill into a workspace's folders."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/workspaces/list-workspaces)",
  version: "0.1.1",
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
    // `String(id)`, matching the app's propDefinition resolvers: every ID prop in this
    // connector is a string, and emitting a bare number here invites a caller to write it
    // back as a JSON number, which rounds a 16-digit ID.
    const options = (data || []).map(({
      id, name,
    }) => ({
      label: name,
      value: String(id),
    }));
    $.export("$summary", `Successfully retrieved ${options.length} workspace${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
