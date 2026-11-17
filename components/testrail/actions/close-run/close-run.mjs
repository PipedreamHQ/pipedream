import app from "../../testrail.app.mjs";

export default {
  key: "testrail-close-run",
  name: "Close Run",
  description: "Closes a TestRail test run. Closing is permanent: a closed run is archived and no more results can be added to it, so never call it on a loose request such as \"wrap up\", \"we are done with\" or \"clean up\" a run. First ask the user \"Close run <name>? This cannot be undone.\" and call this tool only after they say yes (or they already used the word close and named the run). If you cannot get an answer, do not close the run. To start a run use **Create Run**; to find the run ID use **List Runs**. Returns the closed run's id, name, is_completed and completed_on (unix seconds). Example: runId=57 → run 57 with is_completed true. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    const run = await this.app.post({
      $,
      path: `close_run/${this.runId}`,
    });
    $.export("$summary", `Closed run ${run.id}: ${run.name}`);
    return {
      id: run.id,
      name: run.name,
      is_completed: run.is_completed,
      completed_on: run.completed_on,
    };
  },
};
