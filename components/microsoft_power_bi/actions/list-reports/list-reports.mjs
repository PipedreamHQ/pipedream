import app from "../../microsoft_power_bi.app.mjs";

export default {
  key: "microsoft_power_bi-list-reports",
  name: "List Reports",
  description: "List Power BI reports in a workspace."
    + " Defaults to the authenticated user's personal My workspace when no workspace is specified."
    + " Pass `workspaceId` (preferred, from **List Workspaces**) OR `workspaceName` to scope to a specific workspace — the tool resolves the name to an ID server-side."
    + " Each report includes `id`, `name`, `webUrl`, `embedUrl`, `datasetId`, and `reportType` (`PowerBIReport` or `PaginatedReport`)."
    + " Note: reports cannot be created via the REST API — they are published from Power BI Desktop."
    + " [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/reports/get-reports)",
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
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
    workspaceName: {
      propDefinition: [
        app,
        "workspaceName",
      ],
    },
  },
  async run({ $ }) {
    const groupId = await this.app.resolveGroupId({
      $,
      workspaceId: this.workspaceId,
      workspaceName: this.workspaceName,
    });
    const reports = await this.app.listReports({
      $,
      groupId,
    });
    const scope = groupId
      ? `workspace ${this.workspaceName || groupId}`
      : "My workspace";
    $.export("$summary", `Found ${reports.length} report${reports.length === 1
      ? ""
      : "s"} in ${scope}`);
    return reports;
  },
};
