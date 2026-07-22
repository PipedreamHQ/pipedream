import app from "../../mode.app.mjs";

export default {
  key: "mode-create-query",
  name: "Create Query",
  description: "Create a new query in a report. Sent as `{ query: { data_source_id, raw_query, name } }`. `data_source_id` is the integer id (NOT the token) - use **List Data Sources** to find it. Use **List Reports** to find the report token. [See the documentation](https://mode.com/developer/api-reference/analytics/queries/#createQueryInReport)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    reportToken: {
      propDefinition: [
        app,
        "reportToken",
      ],
    },
    dataSourceId: {
      propDefinition: [
        app,
        "dataSourceId",
      ],
      description: "The integer id of the data source to run the query against, e.g. `1234567` (the `id` field, NOT the token). Run the **List Data Sources** action to find available data source ids.",
    },
    rawQuery: {
      type: "string",
      label: "Raw Query",
      description: "The raw SQL query text. Example: `SELECT * FROM orders LIMIT 100`.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Optional name for the query.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createQuery({
      $,
      reportToken: this.reportToken,
      data: {
        query: {
          data_source_id: this.dataSourceId,
          raw_query: this.rawQuery,
          name: this.name,
        },
      },
    });
    $.export("$summary", `Successfully created query "${response?.name ?? response?.token}" in report "${this.reportToken}"`);
    return response;
  },
};
