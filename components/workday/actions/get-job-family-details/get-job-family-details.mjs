import workday from "../../workday.app.mjs";
export default {
  key: "workday-get-job-family-details",
  name: "Get Job Family Details",
  description: "Get job family details by ID. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#staffing/v7/get-/jobProfiles/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    jobFamilyId: {
      propDefinition: [
        workday,
        "jobFamilyId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workday.getJobFamily({
      id: this.jobFamilyId,
      $,
    });
    $.export("$summary", `Fetched job family ${this.jobFamilyId}`);
    return response;
  },
};
