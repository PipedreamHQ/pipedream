import app from "../../databricks.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "databricks-reset-job",
  name: "Reset Job",
  description: "Overwrite all settings for the given job. [See the documentation](https://docs.databricks.com/api/workspace/jobs/reset)",
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
      description: "The new settings for the job as a JSON string. This **fully replaces** all existing job settings. Example: `{\"name\": \"My Job\", \"tasks\": [{\"task_key\": \"task1\", \"notebook_task\": {\"notebook_path\": \"/path/to/notebook\"}}]}`. [See the documentation](https://docs.databricks.com/api/workspace/jobs/reset#new_settings)",
    },
  },
  async run({ $ }) {
    const {
      app,
      jobId,
      newSettings,
    } = this;

    await app.resetJob({
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
