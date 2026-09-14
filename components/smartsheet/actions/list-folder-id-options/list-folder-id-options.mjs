import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-folder-id-options",
  name: "List Folder Options",
  description:
    "Returns a lightweight `{ label, value }` list of folders inside a workspace — just names and IDs."
    + " Use this to find a Folder ID before calling **New Sheet From Template**, **Create Sheet**, or **Import Sheet**"
    + " with a folder destination."
    + " Example: pass `workspaceId: \"1234567890123456\"` to get back folders like"
    + " `[{\"label\": \"Q1 Reports\", \"value\": \"9876543210987654\"}]`."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/workspaces/get-workspace-children)",
  version: "1.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartsheet,
    workspaceId: {
      propDefinition: [
        smartsheet,
        "workspaceId",
      ],
      optional: false,
      description: "The workspace to list folders from. Use **List Workspace Options** to find workspace IDs. Example: `1234567890123456`.",
    },
  },
  async run({ $ }) {
    const { data } = await this.smartsheet.listAllWorkspaceChildren(this.workspaceId, {
      $,
      params: {
        childrenResourceTypes: "folders",
      },
    });
    const options = (data || []).map(({
      id, name,
    }) => ({
      label: name,
      value: id,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} folder${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
