import { ConfigurationError } from "@pipedream/platform";
import app from "../../mode.app.mjs";

export default {
  key: "mode-update-query",
  name: "Update Query",
  description: "Update an existing query in a report. Sent as `{ query: { data_source_id, raw_query, name } }`. `data_source_id` is the integer id (NOT the token) - use **List Data Sources** to find it. Use **List Queries** to find the query token. [See the documentation](https://mode.com/developer/api-reference/analytics/queries/#updateQueryInReport)",
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
    queryToken: {
      propDefinition: [
        app,
        "queryToken",
      ],
    },
    dataSourceId: {
      propDefinition: [
        app,
        "dataSourceId",
      ],
      description: "The integer id of the data source (the `id` field, NOT the token). Run the **List Data Sources** action to find available data source ids.",
      optional: true,
    },
    rawQuery: {
      type: "string",
      label: "Raw Query",
      description: "The raw SQL query text. Example: `SELECT * FROM orders LIMIT 100`.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "New name for the query.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.dataSourceId === undefined && this.rawQuery === undefined
      && this.name === undefined) {
      throw new ConfigurationError(
        "Provide at least one of Data Source ID, Raw Query, or Name to update.",
      );
    }
    const response = await this.app.updateQuery({
      $,
      reportToken: this.reportToken,
      queryToken: this.queryToken,
      data: {
        query: {
          data_source_id: this.dataSourceId,
          raw_query: this.rawQuery,
          name: this.name,
        },
      },
    });
    $.export("$summary", `Successfully updated query "${response?.name ?? this.queryToken}"`);
    return response;
  },
};
