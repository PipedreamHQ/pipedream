import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-job-postings",
  name: "List Job Postings",
  description: "List all job postings. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#recruiting/v4/get-/jobPostings)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
  },
  async run({ $ }) {
    const response = await this.workday.listJobPostings({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} job postings`);
    return response;
  },
};
