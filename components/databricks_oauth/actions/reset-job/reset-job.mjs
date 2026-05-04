import databricks_oauth from "../../databricks_oauth.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "databricks_oauth-reset-job",
  name: "Reset Job",
  description: "Overwrite all settings for the given job. [See the documentation](https://docs.databricks.com/api/workspace/jobs/reset)",
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
    newSettings: {
      type: "string",
      label: "New Settings",
      description: "The new settings for the job as a JSON string. This **fully replaces** all existing job settings. Example: `{\"name\": \"My Job\", \"tasks\": [{\"task_key\": \"task1\", \"notebook_task\": {\"notebook_path\": \"/path/to/notebook\"}}]}`. [See the documentation](https://docs.databricks.com/api/workspace/jobs/reset#new_settings)",
    },
  },
  async run({ $ }) {
    const {
      databricks_oauth,
      jobId,
      newSettings,
    } = this;

    await databricks_oauth.resetJob({
      $,
      data: {
        job_id: jobId,
        new_settings: utils.parseJsonInput(newSettings),
      },
    });

    $.export("$summary", `Successfully reset job with ID \`${jobId}\`.`);

    return {
      success: true,
    };
  },
};
