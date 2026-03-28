import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-job-change-details",
  name: "Get Job Change Details",
  description: "Retrieve details for a specific job change by its ID. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#staffing/v7/get-/jobChanges/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    jobChangeId: {
      propDefinition: [
        workday,
        "jobChangeId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workday.getJobChangeDetails({
      id: this.jobChangeId,
      $,
    });
    $.export("$summary", `Fetched job change details for ID ${this.jobChangeId}`);
    return response;
  },
};
