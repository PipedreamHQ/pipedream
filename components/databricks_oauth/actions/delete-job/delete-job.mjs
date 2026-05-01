import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-delete-job",
  name: "Delete Job",
  description: "Delete a job. Deleted jobs cannot be recovered. [See the documentation](https://docs.databricks.com/api/workspace/jobs/delete)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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

    await databricks_oauth.deleteJob({
      $,
      data: {
        job_id: jobId,
      },
    });

    $.export("$summary", `Successfully deleted job with ID \`${jobId}\`.`);

    return {
      success: true,
    };
  },
};
