import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-workspace-id-options",
  name: "List Workspace Options",
  description:
    "Returns a lightweight `{ label, value }` list of all workspaces the authenticated user can access — just"
    + " names and IDs. Automatically pages through all results internally (token-based pagination), so the full"
    + " list is always returned in one call. Use this to find a Workspace ID before calling **New Sheet From"
    + " Template**, **List Folder Options**, **Create Sheet**, or **Import Sheet**."
    + " Example: returns entries like `[{\"label\": \"Marketing\", \"value\": \"1234567890123456\"}]`."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/workspaces/list-workspaces)",
  version: "0.0.4",
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
