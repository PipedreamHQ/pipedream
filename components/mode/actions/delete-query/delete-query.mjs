import app from "../../mode.app.mjs";

export default {
  key: "mode-delete-query",
  name: "Delete Query",
  description: "Permanently delete a query from a report. [See the documentation](https://mode.com/developer/api-reference/analytics/queries/#deleteQueryInReport)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
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
    const response = await this.app.deleteQuery({
      $,
      reportToken: this.reportToken,
      queryToken: this.queryToken,
    });
    $.export("$summary", `Successfully deleted query "${this.queryToken}" from report "${this.reportToken}"`);
    return response;
  },
};
