import app from "../../microsoft_power_bi.app.mjs";

export default {
  key: "microsoft_power_bi-list-datasets",
  name: "List Datasets",
  description: "List Power BI datasets (semantic models) in a workspace."
    + " Defaults to the authenticated user's personal **My workspace** when no workspace is specified."
    + " Pass `workspaceId` (preferred, from **List Workspaces**) OR `workspaceName` to scope to a specific workspace."
    + " Each dataset includes `id`, `name`, `webUrl`, `addRowsAPIEnabled` (true for Push Datasets), `isRefreshable`, and `defaultMode` (`Push`, `Streaming`, `PushStreaming`, `AsOnPrem`, `AsAzure`)."
    + " Use this tool to resolve a dataset name → ID before calling **Refresh Dataset**, **Execute DAX Query**, **Get Refresh History**, or **Add Rows To Push Dataset**."
    + " For push-dataset row inserts, call the dataset's `GET tables` endpoint (not exposed as a separate tool) by inspecting the dataset's `name` → tables are defined at dataset creation; the table name is the string configured at creation time (e.g., `Species`)."
    + " [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/get-datasets-in-group)",
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
      description: "ID of the workspace to list datasets from. Omit to list datasets in **My workspace**. Use **List Workspaces** to find IDs.",
      optional: true,
    },
    workspaceName: {
      type: "string",
      label: "Workspace Name",
      description: "Name of the workspace to list datasets from (alternative to `workspaceId`). The tool resolves the name to an ID via **List Workspaces**. Ignored if `workspaceId` is set.",
      optional: true,
    },
  },
  async run({ $ }) {
    const groupId = await this.app.resolveGroupId({
      $,
      workspaceId: this.workspaceId,
      workspaceName: this.workspaceName,
    });
    const datasets = await this.app.listDatasets({
      $,
      groupId,
    });
    const scope = groupId
      ? `workspace ${this.workspaceName || groupId}`
      : "My workspace";
    $.export("$summary", `Found ${datasets.length} dataset${datasets.length === 1
      ? ""
      : "s"} in ${scope}`);
    return datasets;
  },
};
