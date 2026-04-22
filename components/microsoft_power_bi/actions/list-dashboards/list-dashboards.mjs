import app from "../../microsoft_power_bi.app.mjs";

export default {
  key: "microsoft_power_bi-list-dashboards",
  name: "List Dashboards",
  description: "List Power BI dashboards in a workspace."
    + " Defaults to the authenticated user's personal **My workspace** when no workspace is specified."
    + " Pass `workspaceId` (preferred, from **List Workspaces**) OR `workspaceName` to scope to a specific workspace."
    + " Each dashboard includes `id`, `displayName`, `isReadOnly`, `webUrl`, and `embedUrl`."
    + " Note: dashboards cannot be created via the REST API — they are built interactively in the Power BI service."
    + " [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/dashboards/get-dashboards-in-group)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "ID of the workspace to list dashboards from. Omit to list dashboards in **My workspace**. Use **List Workspaces** to find IDs.",
      optional: true,
    },
    workspaceName: {
      type: "string",
      label: "Workspace Name",
      description: "Name of the workspace to list dashboards from (alternative to `workspaceId`). The tool resolves the name to an ID via **List Workspaces**. Ignored if `workspaceId` is set.",
      optional: true,
    },
  },
  async run({ $ }) {
    const groupId = await this.app.resolveGroupId({
      $,
      workspaceId: this.workspaceId,
      workspaceName: this.workspaceName,
    });
    const dashboards = await this.app.listDashboards({
      $,
      groupId,
    });
    const scope = groupId
      ? `workspace ${this.workspaceName || groupId}`
      : "My workspace";
    $.export("$summary", `Found ${dashboards.length} dashboard${dashboards.length === 1
      ? ""
      : "s"} in ${scope}`);
    return dashboards;
  },
};
