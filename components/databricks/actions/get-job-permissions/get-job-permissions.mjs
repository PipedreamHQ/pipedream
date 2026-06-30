import app from "../../databricks.app.mjs";

export default {
  key: "databricks-get-job-permissions",
  name: "Get Job Permissions",
  description: "Get permissions of a job. [See the documentation](https://docs.databricks.com/api/workspace/jobs/getpermissions)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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

    const response = await app.getJobPermissions({
      $,
      jobId,
    });

    $.export("$summary", `Successfully retrieved permissions for job with ID \`${jobId}\`.`);

    return response;
  },
};
