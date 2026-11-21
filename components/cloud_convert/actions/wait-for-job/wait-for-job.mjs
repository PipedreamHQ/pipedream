import app from "../../cloud_convert.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "cloud_convert-wait-for-job",
  name: "Wait for Job",
  description: "Waits until a job has finished and returns it with all of its tasks. The output file URLs are available in `result.files` of the finished `export/url` tasks. Throws if the job failed. Not recommended for long-running jobs, use a webhook or the **Job Finished (Instant)** source instead. [See the documentation](https://cloudconvert.com/api/v2/jobs#jobs-wait)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
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
    const response = await this.app.waitForJob({
      $,
      jobId: this.jobId,
    });

    utils.throwIfFailed("job", response.data);

    $.export("$summary", `Job \`${response.data.id}\` finished with status \`${response.data.status}\``);
    return response;
  },
};
