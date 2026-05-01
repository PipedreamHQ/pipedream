import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-get-job-permissions",
  name: "Get Job Permissions",
  description: "Get permissions of a job. [See the documentation](https://docs.databricks.com/api/workspace/jobs/getpermissions)",
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

    const response = await databricks_oauth.getJobPermissions({
      $,
      jobId,
    });

    $.export("$summary", `Successfully retrieved permissions for job with ID \`${jobId}\`.`);

    return response;
  },
};
