import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-get-job",
  name: "Get Job",
  description: "Retrieves the details for a single job. [See the documentation](https://docs.databricks.com/api/workspace/jobs/get)",
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
    },
  },
  async run({ $ }) {
    const {
      databricks_oauth,
      jobId,
    } = this;

    const response = await databricks_oauth.getJob({
      $,
      params: {
        job_id: jobId,
      },
    });

    $.export("$summary", `Successfully retrieved job with ID \`${response.job_id}\`.`);

    return response;
  },
};
