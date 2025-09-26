import app from "../../databricks.app.mjs";

export default {
  key: "databricks-cancel-run",
  name: "Cancel Run",
  description: "Cancel a job run. The run is canceled asynchronously, so it may still be running when this request completes. [See the documentation](https://docs.databricks.com/api/workspace/jobs/cancelrun)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
    const {
      app,
      runId,
    } = this;

    await app.cancelRun({
      $,
      data: {
        run_id: runId,
      },
    });

    $.export("$summary", `Successfully initiated cancellation of run with ID \`${runId}\`.`);

    return {
      success: true,
    };
  },
};
