import app from "../../cloud_convert.app.mjs";

export default {
  key: "cloud_convert-get-job",
  name: "Get Job",
  description: "Retrieves a job and its tasks by ID, without waiting for it to finish. The output file URLs are available in `result.files` of the finished `export/url` tasks. [See the documentation](https://cloudconvert.com/api/v2/jobs#jobs-show)",
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
    const response = await this.app.getJob({
      $,
      jobId: this.jobId,
    });

    $.export("$summary", `Successfully retrieved job with ID \`${response.data.id}\` (status: ${response.data.status})`);
    return response;
  },
};
