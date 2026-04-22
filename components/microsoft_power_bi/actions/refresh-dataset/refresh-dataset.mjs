import app from "../../microsoft_power_bi.app.mjs";

export default {
  key: "microsoft_power_bi-refresh-dataset",
  name: "Refresh Dataset",
  description: "Trigger a refresh of a Power BI dataset. Returns 202 Accepted on success; the request ID is available in the `Location` response header (last path segment) and `x-ms-request-id` header — use **Get Refresh History** to check status."
    + " Use **List Datasets** first to resolve a dataset name → `datasetId`."
    + " Pass `workspaceId` (from **List Workspaces**) or `workspaceName` to target a specific workspace, or omit both for My workspace."
    + " `notifyOption` controls email notifications on refresh outcome: `NoNotification` (default), `MailOnCompletion`, or `MailOnFailure`."
    + " Power BI Pro licenses allow up to 8 scheduled refreshes per day; Premium allows 48."
    + " Note: Push datasets accept this endpoint but the refresh is metadata-only (tile refresh), not a data refresh — no cancellable history entry is produced."
    + " [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/refresh-dataset-in-group)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    datasetId: {
      type: "string",
      label: "Dataset ID",
      description: "ID of the dataset to refresh. Use **List Datasets** to find IDs by name.",
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "ID of the workspace containing the dataset. Omit to target My workspace.",
      optional: true,
    },
    workspaceName: {
      type: "string",
      label: "Workspace Name",
      description: "Name of the workspace (alternative to `workspaceId`). Resolved via **List Workspaces**.",
      optional: true,
    },
    notifyOption: {
      type: "string",
      label: "Notify Option",
      description: "Email notification behavior on refresh outcome.",
      options: [
        "NoNotification",
        "MailOnCompletion",
        "MailOnFailure",
      ],
      optional: true,
      default: "NoNotification",
    },
  },
  async run({ $ }) {
    const groupId = await this.app.resolveGroupId({
      $,
      workspaceId: this.workspaceId,
      workspaceName: this.workspaceName,
    });
    const response = await this.app.refreshDataset({
      $,
      datasetId: this.datasetId,
      groupId,
      data: {
        notifyOption: this.notifyOption ?? "NoNotification",
      },
      returnFullResponse: true,
    });
    const headers = response?.headers ?? {};
    const location = headers.location || headers.Location;
    const requestIdFromLocation = location?.split("/").filter(Boolean)
      .pop();
    const requestId = requestIdFromLocation
      || headers["x-ms-request-id"]
      || headers.requestid;

    $.export("$summary", `Triggered refresh of dataset ${this.datasetId}${requestId
      ? ` (requestId ${requestId})`
      : ""}`);
    return {
      status: response?.status ?? 202,
      requestId,
      datasetId: this.datasetId,
      groupId,
      location,
      headers,
    };
  },
};
