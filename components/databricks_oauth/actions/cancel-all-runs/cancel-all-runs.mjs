import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-cancel-all-runs",
  name: "Cancel All Runs",
  description: "Cancel all active runs for a job. The runs are canceled asynchronously, so it doesn't prevent new runs from being started. [See the documentation](https://docs.databricks.com/api/workspace/jobs/cancelallruns)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    databricks_oauth,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Either a **Job** or **All Queued Runs** must be provided.",
    },
    jobId: {
      optional: true,
      propDefinition: [
        databricks_oauth,
        "jobId",
      ],
    },
    allQueuedRuns: {
      type: "boolean",
      label: "All Queued Runs",
      description: "Optional boolean parameter to cancel all queued runs. If no **Job ID** is provided, all queued runs in the workspace are canceled.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      databricks_oauth,
      jobId,
      allQueuedRuns,
    } = this;

    await databricks_oauth.cancelAllRuns({
      $,
      data: {
        job_id: jobId,
        all_queued_runs: allQueuedRuns,
      },
    });

    $.export("$summary", "Successfully initiated cancellation of all runs");

    return {
      success: true,
    };
  },
};
