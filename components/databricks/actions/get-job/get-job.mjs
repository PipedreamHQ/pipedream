import app from "../../databricks.app.mjs";

export default {
  key: "databricks-get-job",
  name: "Get Job",
  description: "Retrieves the details for a single job. [See the documentation](https://docs.databricks.com/api/workspace/jobs/get)",
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

    const response = await app.getJob({
      $,
      params: {
        job_id: jobId,
      },
    });

    $.export("$summary", `Successfully retrieved job with ID \`${response.job_id}\`.`);

    return response;
  },
};
