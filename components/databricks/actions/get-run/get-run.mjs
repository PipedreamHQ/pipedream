import app from "../../databricks.app.mjs";

export default {
  key: "databricks-get-run",
  name: "Get Run",
  description: "Retrieve the metadata of a run. [See the documentation](https://docs.databricks.com/api/workspace/jobs/getrun)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    runId: {
      propDefinition: [
        app,
        "runId",
      ],
    },
    includeHistory: {
      type: "boolean",
      label: "Include History",
      description: "Whether to include the repair history in the response",
      optional: true,
    },
    includeResolvedValues: {
      type: "boolean",
      label: "Include Resolved Values",
      description: "Whether to include resolved parameter values in the response",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      runId,
      includeHistory,
      includeResolvedValues,
    } = this;

    const response = await app.getRun({
      $,
      params: {
        run_id: runId,
        include_history: includeHistory,
        include_resolved_values: includeResolvedValues,
      },
    });

    $.export("$summary", `Successfully retrieved run with ID \`${response.job_run_id}\`.`);

    return response;
  },
};
