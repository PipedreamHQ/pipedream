import app from "../../microsoft_power_bi.app.mjs";

export default {
  key: "microsoft_power_bi-get-refresh-history",
  name: "Get Refresh History",
  description: "Get the refresh history for a Power BI dataset."
    + " Use **List Datasets** first to resolve a dataset name → `datasetId`."
    + " Pass `workspaceId` (from **List Workspaces**) or `workspaceName` to scope to a specific workspace, or omit both for My workspace."
    + " Each entry includes `requestId`, `refreshType` (`OnDemand`, `Scheduled`, `ViaApi`, etc.), `startTime`, `endTime`, `status` (`Completed`, `Failed`, `Disabled`, `Cancelled`, `Unknown` — `Unknown` means still in progress), and `serviceExceptionJson` on failures."
    + " [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/get-refresh-history-in-group)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    datasetId: {
      type: "string",
      label: "Dataset ID",
      description: "ID of the dataset. Use **List Datasets** to find IDs by name.",
    },
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
    top: {
      type: "integer",
      label: "Top",
      description: "Number of refresh entries to return (most recent first). Max 200. Omit to return the default page.",
      optional: true,
    },
  },
  async run({ $ }) {
    const groupId = await this.app.resolveGroupId({
      $,
      workspaceId: this.workspaceId,
      workspaceName: this.workspaceName,
    });
    const history = await this.app.getRefreshHistory({
      $,
      datasetId: this.datasetId,
      groupId,
      params: {
        ["$top"]: this.top,
      },
    });
    $.export("$summary", `Found ${history.length} refresh record${history.length === 1
      ? ""
      : "s"} for dataset ${this.datasetId}`);
    return history;
  },
};
