import app from "../../mode.app.mjs";

export default {
  key: "mode-get-query",
  name: "Get Query",
  description: "Retrieve a single query within a report by its token. Use **List Queries** to find the query token. [See the documentation](https://mode.com/developer/api-reference/analytics/queries/#getQueryInReport)",
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
    queryToken: {
      propDefinition: [
        app,
        "queryToken",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getQuery({
      $,
      reportToken: this.reportToken,
      queryToken: this.queryToken,
    });
    $.export("$summary", `Successfully retrieved query "${response?.name ?? this.queryToken}"`);
    return response;
  },
};
