import workday from "../../workday.app.mjs";
export default {
  key: "workday-get-job-details",
  name: "Get Job Details",
  description: "Get job details by ID.[See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#staffing/v7/get-/jobs/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    jobId: {
      propDefinition: [
        workday,
        "jobId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workday.getJob({
      id: this.jobId,
      $,
    });
    $.export("$summary", `Fetched job ${this.jobId}`);
    return response;
  },
};
