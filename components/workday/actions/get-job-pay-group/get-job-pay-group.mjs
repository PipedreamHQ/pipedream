import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-job-pay-group",
  name: "Get Job Pay Group",
  description: "Get the payroll job's pay group by ID. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#payroll/v2/get-/jobs/-ID-/payGroup)",
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
    const response = await this.workday.getJobPayGroup({
      id: this.jobId,
      $,
    });
    $.export("$summary", `Fetched pay group for job ID ${this.jobId}`);
    return response;
  },
};
