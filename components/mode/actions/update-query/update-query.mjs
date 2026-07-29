import { ConfigurationError } from "@pipedream/platform";
import app from "../../mode.app.mjs";

export default {
  key: "mode-update-query",
  name: "Update Query",
  description: "Update an existing query in a report. [See the documentation](https://mode.com/developer/api-reference/analytics/queries/#updateQueryInReport)",
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
    if (!this.dataSourceId && !this.rawQuery && !this.name) {
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
