import app from "../../mode.app.mjs";

export default {
  key: "mode-list-queries",
  name: "List Queries",
  description: "List all queries belonging to a report. Use **List Reports** to find the report token, then use this to find `query` tokens for **Get Query**, **Update Query**, and **Delete Query**. [See the documentation](https://mode.com/developer/api-reference/analytics/queries/#listQueriesInReport)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const response = await this.app.listQueries({
      $,
      reportToken: this.reportToken,
    });
    const queries = response?._embedded?.queries ?? response;
    const count = Array.isArray(queries)
      ? queries.length
      : 0;
    $.export("$summary", `Successfully retrieved ${count} quer(y/ies) for report "${this.reportToken}"`);
    return response;
  },
};
