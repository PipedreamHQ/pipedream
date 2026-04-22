import app from "../../microsoft_power_bi.app.mjs";

export default {
  key: "microsoft_power_bi-execute-dax-query",
  name: "Execute DAX Query",
  description: "Execute a DAX (Data Analysis Expressions) query against a Power BI dataset (semantic model)."
    + " This is the primary analytics tool — use it to answer questions about values, aggregates, or filtered rows in a dataset."
    + " Use **List Datasets** first to resolve a dataset name → `datasetId`."
    + " The query must be a single valid DAX expression starting with `EVALUATE`."
    + " Common patterns:"
    + " • List all rows of a table — `EVALUATE 'Species'`"
    + " • Filter — `EVALUATE FILTER('Species', 'Species'[dietType] = \"Carnivore\")`"
    + " • Top N by column — `EVALUATE TOPN(5, 'Species', 'Species'[weightKg], DESC)`"
    + " • Aggregate single value — `EVALUATE ROW(\"Total\", SUMX('Species', 'Species'[weightKg]))`"
    + " • Peek at a table's columns — `EVALUATE TOPN(0, 'Species')` (returns an empty rowset with column names in the response)."
    + " Limits: max 100,000 rows or 1,000,000 values per query, and `DEFINE`/multiple-statement queries are not supported via REST."
    + " The tenant must have 'Dataset Execute Queries REST API' enabled (admin setting) or the call returns 401/403."
    + " Pass `workspaceId` (from **List Workspaces**) or `workspaceName` to target a specific workspace, or omit both for My workspace."
    + " [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/execute-queries-in-group)",
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
      description: "ID of the dataset to query. Use **List Datasets** to find IDs by name.",
    },
    query: {
      type: "string",
      label: "DAX Query",
      description: "A single DAX expression. Must start with `EVALUATE`. Example: `EVALUATE FILTER('Species', 'Species'[dietType] = \"Carnivore\")`.",
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
    includeNulls: {
      type: "boolean",
      label: "Include Nulls",
      description: "If true (default), null values are included in the response. Set to false for compacter output when nulls are not meaningful.",
      optional: true,
      default: true,
    },
    impersonatedUserName: {
      type: "string",
      label: "Impersonated User Name",
      description: "UPN of an effective identity to use for Row-Level Security (RLS). Typically only needed for datasets with RLS roles configured.",
      optional: true,
    },
  },
  async run({ $ }) {
    const groupId = await this.app.resolveGroupId({
      $,
      workspaceId: this.workspaceId,
      workspaceName: this.workspaceName,
    });
    const data = {
      queries: [
        {
          query: this.query,
        },
      ],
      serializerSettings: {
        includeNulls: this.includeNulls ?? true,
      },
    };
    if (this.impersonatedUserName) {
      data.impersonatedUserName = this.impersonatedUserName;
    }
    const response = await this.app.executeQueries({
      $,
      datasetId: this.datasetId,
      groupId,
      data,
    });
    const rowCount = response.results?.[0]?.tables?.[0]?.rows?.length ?? 0;
    $.export("$summary", `DAX query returned ${rowCount} row${rowCount === 1
      ? ""
      : "s"}`);
    return response;
  },
};
