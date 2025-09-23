import app from "../../databricks.app.mjs";

export default {
  key: "databricks-cancel-all-runs",
  name: "Cancel All Runs",
  description: "Cancel all active runs for a job. The runs are canceled asynchronously, so it doesn't prevent new runs from being started. [See the documentation](https://docs.databricks.com/api/workspace/jobs/cancelallruns)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Either a **Job** or **All Queued Runs** must be provided.",
    },
    jobId: {
      optional: true,
      propDefinition: [
        app,
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
      app,
      jobId,
      allQueuedRuns,
    } = this;

    await app.cancelAllRuns({
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
