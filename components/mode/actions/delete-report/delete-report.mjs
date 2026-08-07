import app from "../../mode.app.mjs";

export default {
  key: "mode-delete-report",
  name: "Delete Report",
  description: "Permanently delete a report. [See the documentation](https://mode.com/developer/api-reference/analytics/reports/#deleteReport)",
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
  },
  async run({ $ }) {
    const response = await this.app.deleteReport({
      $,
      reportToken: this.reportToken,
    });
    $.export("$summary", `Successfully deleted report "${this.reportToken}"`);
    return response;
  },
};
