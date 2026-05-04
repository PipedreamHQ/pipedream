import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-get-run",
  name: "Get Run",
  description: "Retrieve the metadata of a run. [See the documentation](https://docs.databricks.com/api/workspace/jobs/getrun)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
      databricks_oauth,
      runId,
      includeHistory,
      includeResolvedValues,
    } = this;

    const response = await databricks_oauth.getRun({
      $,
      params: {
        run_id: runId,
        include_history: includeHistory,
        include_resolved_values: includeResolvedValues,
      },
    });

    $.export("$summary", `Successfully retrieved run with ID \`${response.run_id}\`.`);

    return response;
  },
};
