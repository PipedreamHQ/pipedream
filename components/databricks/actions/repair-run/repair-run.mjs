import app from "../../databricks.app.mjs";

export default {
  key: "databricks-repair-run",
  name: "Repair Run",
  description: "Re-run one or more tasks. [See the documentation](https://docs.databricks.com/api/workspace/jobs/repairrun)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Either a **Rerun Tasks** or **Rerun All Failed Tasks** must be provided.",
    },
    runId: {
      propDefinition: [
        app,
        "runId",
      ],
    },
    rerunTasks: {
      type: "string[]",
      label: "Rerun Tasks",
      description: "The task keys of the task runs to repair",
      optional: true,
    },
    rerunAllFailedTasks: {
      type: "boolean",
      label: "Rerun All Failed Tasks",
      description: "If true, repair all failed tasks. Only one of rerun_tasks or rerun_all_failed_tasks can be used",
      optional: true,
    },
    pipelineParamsFullRefresh: {
      type: "boolean",
      label: "Pipeline Params - Full Refresh",
      description: "Controls whether the pipeline should perform a full refresh",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      runId,
      rerunTasks,
      rerunAllFailedTasks,
      pipelineParamsFullRefresh,
    } = this;

    const response = await app.repairRun({
      $,
      data: {
        run_id: runId,
        rerun_tasks: rerunTasks,
        rerun_all_failed_tasks: rerunAllFailedTasks,
        pipeline_params: {
          full_refresh: pipelineParamsFullRefresh,
        },
      },
    });

    $.export("$summary", `Successfully initiated repair of run with ID \`${response.repair_id}\`.`);

    return response;
  },
};
