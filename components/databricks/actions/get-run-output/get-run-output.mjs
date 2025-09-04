import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-get-run-output",
  name: "Get Run Output",
  description: "Retrieve the output and metadata of a single task run. [See the documentation](https://docs.databricks.com/en/workflows/jobs/jobs-2.0-api.html#runs-get-output)",
  version: "0.0.4",
  type: "action",
  props: {
    databricks,
    jobId: {
      propDefinition: [
        databricks,
        "jobId",
      ],
      optional: true,
    },
    runId: {
      propDefinition: [
        databricks,
        "runId",
        (c) => ({
          jobId: c.jobId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.databricks.getRunOutput({
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
