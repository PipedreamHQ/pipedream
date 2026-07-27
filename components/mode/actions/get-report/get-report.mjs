import app from "../../mode.app.mjs";

export default {
  key: "mode-get-report",
  name: "Get Report",
  description: "Retrieve a single report by its token. [See the documentation](https://mode.com/developer/api-reference/analytics/reports/#getReport)",
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
    const response = await this.app.getReport({
      $,
      reportToken: this.reportToken,
    });
    $.export("$summary", `Successfully retrieved report "${response?.name ?? this.reportToken}"`);
    return response;
  },
};
