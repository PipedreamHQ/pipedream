import app from "../../jobvetta.app.mjs";

export default {
  key: "jobvetta-get-job-details",
  name: "Get Job Details",
  description: "Retrieve full 70+ field structured job details, qualifications, extracted skills, and salary bounds by Job ID. [See the documentation](https://www.jobvetta.com/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    jobId: {
      type: "string",
      label: "Job ID",
      description: "A `job_id` returned by **Search Jobs** or **Get Company Hiring Signals**, or `latest` to inspect a sample live posting",
    },
  },
  async run({ $ }) {
    const response = await this.app.getJobDetails({
      $,
      jobId: this.jobId,
    });
    $.export("$summary", `Retrieved job details for ${response.title || this.jobId}`);
    return response;
  },
};
