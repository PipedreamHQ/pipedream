import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-cancel-run",
  name: "Cancel Run",
  description: "Cancel a job run. The run is canceled asynchronously, so it may still be running when this request completes. [See the documentation](https://docs.databricks.com/api/workspace/jobs/cancelrun)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    databricks_oauth,
    runId: {
      propDefinition: [
        databricks_oauth,
        "runId",
      ],
    },
  },
  async run({ $ }) {
    const {
      databricks_oauth,
      runId,
    } = this;

    await databricks_oauth.cancelRun({
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
