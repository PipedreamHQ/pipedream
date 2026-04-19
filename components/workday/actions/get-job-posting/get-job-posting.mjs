import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-job-posting",
  name: "Get Job Posting",
  description: "Get details for a job posting by ID. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#recruiting/v4/get-/jobPostings/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    jobPostingId: {
      propDefinition: [
        workday,
        "jobPostingId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workday.getJobPosting({
      id: this.jobPostingId,
      $,
    });
    $.export("$summary", `Fetched details for job posting ID ${this.jobPostingId}`);
    return response;
  },
};
