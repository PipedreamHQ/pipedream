import app from "../../databricks.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "databricks-set-job-permissions",
  name: "Set Job Permissions",
  description: "Set permissions on a job. [See the documentation](https://docs.databricks.com/api/workspace/jobs/setpermissions)",
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
      app,
      jobId,
      accessControlList,
    } = this;

    const response = await app.setJobPermissions({
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
