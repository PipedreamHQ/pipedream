import app from "../../mode.app.mjs";

export default {
  key: "mode-get-report-run",
  name: "Get Report Run",
  description: "Retrieve a single report run, including its `state` (pending, enqueued, running_notebook, succeeded, failed, cancelled, completed). Use this to poll a run triggered by **Run Report**. [See the documentation](https://mode.com/developer/api-reference/analytics/report-runs/#getReportRun)",
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
    runToken: {
      type: "string",
      label: "Run Token",
      description: "The token of the run to retrieve, e.g. `9fabcf384694`. Returned in the `token` field by the **Run Report** action or **List Report Runs**.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getReportRun({
      $,
      reportToken: this.reportToken,
      runToken: this.runToken,
    });
    $.export("$summary", `Successfully retrieved run "${this.runToken}" - state: "${response?.state}"`);
    return response;
  },
};
