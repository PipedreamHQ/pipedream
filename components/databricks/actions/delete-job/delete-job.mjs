import app from "../../databricks.app.mjs";

export default {
  key: "databricks-delete-job",
  name: "Delete Job",
  description: "Delete a job. Deleted jobs cannot be recovered. [See the documentation](https://docs.databricks.com/api/workspace/jobs/delete)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    jobId: {
      propDefinition: [
        app,
        "jobId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      jobId,
    } = this;

    await app.deleteJob({
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
