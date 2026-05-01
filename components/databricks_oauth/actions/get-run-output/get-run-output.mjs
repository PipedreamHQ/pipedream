import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-get-run-output",
  name: "Get Run Output",
  description: "Retrieve the output and metadata of a single task run. [See the documentation](https://docs.databricks.com/en/workflows/jobs/jobs-2.0-api.html#runs-get-output)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    databricks_oauth,
    jobId: {
      propDefinition: [
        databricks_oauth,
        "jobId",
      ],
      optional: true,
    },
    runId: {
      propDefinition: [
        databricks_oauth,
        "runId",
        (c) => ({
          jobId: c.jobId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.databricks_oauth.getRunOutput({
      params: {
        run_id: this.runId,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved output for run with ID ${this.runId}.`);
    }

    return response;
  },
};
