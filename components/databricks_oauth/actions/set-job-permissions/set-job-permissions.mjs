import databricks_oauth from "../../databricks_oauth.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "databricks_oauth-set-job-permissions",
  name: "Set Job Permissions",
  description: "Set permissions on a job. [See the documentation](https://docs.databricks.com/api/workspace/jobs/setpermissions)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
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
    accessControlList: {
      type: "string[]",
      label: "Access Control List",
      description: `List of permissions to set on the job. JSON string format with array of permission objects. [See the documentation](https://docs.databricks.com/api/workspace/jobs/setpermissions#access_control_list)

**Example:**
\`\`\`json
[
  {
    "permission_level": "IS_OWNER",
    "user_name": "user@example.com"
  }
]
\`\`\`
`,
    },
  },
  async run({ $ }) {
    const {
      databricks_oauth,
      jobId,
      accessControlList,
    } = this;

    const response = await databricks_oauth.setJobPermissions({
      $,
      jobId,
      data: {
        access_control_list: utils.parseJsonInput(accessControlList),
      },
    });

    $.export("$summary", `Successfully set permissions for job with ID \`${jobId}\`.`);

    return response;
  },
};
