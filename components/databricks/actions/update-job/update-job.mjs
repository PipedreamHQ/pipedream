import app from "../../databricks.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "databricks-update-job",
  name: "Update Job",
  description: "Update an existing job. Only the fields that are provided will be updated. [See the documentation](https://docs.databricks.com/api/workspace/jobs/update)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    newSettings: {
      type: "string",
      label: "New Settings",
      description: `The updated job settings. JSON string format with only the fields you want to update. [See the API documentation](https://docs.databricks.com/api/workspace/jobs/update#new_settings)

**Example:**
\`\`\`json
{
  "name": "New Job Name"
}
\`\`\`
      `,
      optional: true,
    },
    fieldsToRemove: {
      type: "string[]",
      label: "Fields to Remove",
      description: "List of field paths to remove from the job settings. [See the API documentation](https://docs.databricks.com/api/workspace/jobs/update#fields_to_remove)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      jobId,
      newSettings,
      fieldsToRemove,
    } = this;

    await app.updateJob({
      $,
      data: {
        job_id: jobId,
        new_settings: utils.parseJsonInput(newSettings),
        fields_to_remove: utils.parseJsonInput(fieldsToRemove),
      },
    });

    $.export("$summary", `Successfully updated job with ID \`${jobId}\`.`);

    return {
      success: true,
    };
  },
};
