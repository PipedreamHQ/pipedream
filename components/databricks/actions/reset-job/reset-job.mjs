import app from "../../databricks.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "databricks-reset-job",
  name: "Reset Job",
  description: "Overwrite all settings for the given job. [See the documentation](https://docs.databricks.com/api/workspace/jobs/reset)",
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
    newSettings: {
      type: "string",
      label: "New Settings",
      description: "The new settings for the job. JSON string format with the complete job specification. [See the documentation](https://docs.databricks.com/api/workspace/jobs/reset#new_settings)",
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
