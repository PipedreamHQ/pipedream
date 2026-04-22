import { ConfigurationError } from "@pipedream/platform";
import app from "../../microsoft_power_bi.app.mjs";

export default {
  key: "microsoft_power_bi-add-rows-to-push-dataset",
  name: "Add Rows To Push Dataset",
  description: "Append rows to a table in a Power BI Push Dataset (streaming / realtime data)."
    + " Only works for datasets created via the REST API with `defaultMode: Push` — these datasets expose `addRowsAPIEnabled: true` on the object returned by **List Datasets**."
    + " Use **List Datasets** first to resolve a dataset name → `datasetId` and inspect its `tables` for the exact `tableName` (case-sensitive)."
    + " Pass `workspaceId` (from **List Workspaces**) or `workspaceName` to target a specific workspace, or omit both for My workspace."
    + " Rows must match the table's column schema. `rows` accepts either a JSON array (`[{...}, {...}]`) or a JSON-stringified array. Each row is an object of `columnName → value`."
    + " Common mistakes: (1) case mismatch on `tableName` returns 404 — copy the exact string from the dataset's `tables` array. (2) Sending values that don't match the declared column data type returns `RequestedResourceNotFound` or `DMTS_DatasourceHasNoCredentialsError`."
    + " Push-dataset rows have no individual IDs and cannot be updated or deleted — only appended or bulk-cleared."
    + " [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/push-datasets/datasets-post-rows-in-group)",
  version: "0.0.2",
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
      description: "ID of the Push Dataset. Use **List Datasets** to find IDs — Push Datasets have `addRowsAPIEnabled: true`.",
    },
    tableName: {
      type: "string",
      label: "Table Name",
      description: "Exact (case-sensitive) name of the table within the dataset. Found in the dataset's `tables` array via **List Datasets**. Example: `Species`.",
    },
    rows: {
      type: "string",
      label: "Rows",
      description: "JSON array of row objects matching the table's column schema."
        + " Example: `[{\"id\": \"sp-100\", \"name\": \"Indominus Rex\", \"dietType\": \"Carnivore\", \"heightCm\": 550, \"weightKg\": 7000}]`."
        + " Accepts a JSON string or a pre-parsed array.",
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
  },
  async run({ $ }) {
    const groupId = await this.app.resolveGroupId({
      $,
      workspaceId: this.workspaceId,
      workspaceName: this.workspaceName,
    });

    let rows = this.rows;
    if (typeof rows === "string") {
      try {
        rows = JSON.parse(rows);
      } catch {
        throw new ConfigurationError("`rows` must be a JSON array or a JSON-stringified array.");
      }
    }
    if (!Array.isArray(rows)) {
      throw new ConfigurationError("`rows` must be an array of row objects.");
    }

    const response = await this.app.addRowsToTable({
      $,
      datasetId: this.datasetId,
      tableName: this.tableName,
      groupId,
      data: {
        rows,
      },
    });

    $.export("$summary", `Appended ${rows.length} row${rows.length === 1
      ? ""
      : "s"} to table "${this.tableName}" in dataset ${this.datasetId}`);
    return response ?? {
      success: true,
      rowsAdded: rows.length,
    };
  },
};
