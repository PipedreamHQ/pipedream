import app from "../../mode.app.mjs";

export default {
  key: "mode-run-report",
  name: "Run Report",
  description: "Trigger a new run of a report. Returns a run object whose `token` can be passed to **Get Report Run** to poll the run state. Use **List Reports** to find the report token. [See the documentation](https://mode.com/developer/api-reference/analytics/report-runs/#runReport)",
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
    parameters: {
      type: "object",
      label: "Parameters",
      description: "Optional custom parameter values for the run, sent as `{ parameters: { ... } }`. Example: `{\"start_date\": \"2026-01-01\", \"region\": \"us\"}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.runReport({
      $,
      reportToken: this.reportToken,
      data: {
        parameters: this.parameters,
      },
    });
    $.export("$summary", `Successfully triggered run for report "${this.reportToken}" - run token: "${response?.token}"`);
    return response;
  },
};
