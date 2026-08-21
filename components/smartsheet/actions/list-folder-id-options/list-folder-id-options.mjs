// x-pd-ai: optimized
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-folder-id-options",
  name: "List Folder Options",
  description: "Retrieves `{ label, value }` pairs for populating a Folder dropdown, for one workspace."
    + " This is a form helper, not a Smartsheet capability: it returns only folder names and IDs."
    + " Requires a Workspace ID - use **List Workspace Options** to find one first."
    + " Use the folder IDs it returns with **Create Sheet**, **Import Sheet**, **Copy Sheet** or **Move Sheet**."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/workspaces/get-workspace-children)",
  version: "2.0.0",
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
      description: "The workspace to list folders from. Example: `1234567890123456`.",
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
