import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-template-id-options",
  name: "List Template ID Options",
  description:
    "Returns a lightweight `{ label, value }` list of sheet templates across all workspaces — just names"
    + " (with their workspace) and IDs. Use this to find a Template ID before calling **New Sheet From Template**."
    + " Example: returns entries like `[{\"label\": \"Project Plan (Marketing)\", \"value\": \"1122334455667788\"}]`."
    + " For richer per-template metadata grouped by workspace, use **List Workspace Templates** instead."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/workspaces/get-workspace-children)",
  version: "0.0.5",
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
    const { data: workspaces } = await this.smartsheet.listAllWorkspaces({
      $,
    });
    const childrenByWorkspace = await Promise.all((workspaces || []).map((ws) =>
      this.smartsheet.listAllWorkspaceChildren(ws.id, {
        $,
        params: {
          childrenResourceTypes: "sheets,templates",
        },
      }).then(({ data }) => ({
        ws,
        data,
      }))));

    const options = [];
    for (const {
      ws, data: children,
    } of childrenByWorkspace) {
      for (const child of children || []) {
        if (child.resourceType === "template") {
          options.push({
            label: `${child.name} (${ws.name})`,
            value: child.id,
          });
        }
      }
    }

    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
