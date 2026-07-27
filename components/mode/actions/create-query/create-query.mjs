import app from "../../mode.app.mjs";

export default {
  key: "mode-create-query",
  name: "Create Query",
  description: "Create a new query in a report. [See the documentation](https://mode.com/developer/api-reference/analytics/queries/#createQueryInReport)",
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
