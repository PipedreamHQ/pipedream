import app from "../../testrail.app.mjs";

export default {
  key: "testrail-close-run",
  name: "Close Run",
  description: "Close a TestRail test run. IRREVERSIBLE: a closed run is archived and read-only — results can no longer be added or changed. Before calling, tell the user which run will be closed (name and pass/fail counts from **List Runs**) and get their explicit confirmation in a message from the user. If you cannot ask the user or no confirmation has arrived, do NOT call this tool — stop and ask instead; never assume consent. Use **List Runs** to find the `runId`. Example: runId=91 → returns the run with is_completed=true. Do not use to merely stop working on a run; leave it open instead. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077874763156-Runs#closerun)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    runId: {
      propDefinition: [
        app,
        "runId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.closeRun({
      $,
      runId: this.runId,
    });
    $.export("$summary", `Closed run ${response.id}: ${response.name}`);
    return response;
  },
};
