import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-folder-id-options",
  name: "List Folder Options",
  description: "Retrieves available folder options from a workspace."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/workspaces/get-workspace-children)",
  version: "1.0.1",
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
