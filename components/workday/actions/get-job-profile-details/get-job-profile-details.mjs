import workday from "../../workday.app.mjs";
export default {
  key: "workday-get-job-profile-details",
  name: "Get Job Profile Details",
  description: "Get job profile details by ID. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#staffing/v7/get-/jobProfiles/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    jobProfileId: {
      propDefinition: [
        workday,
        "jobProfileId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workday.getJobProfile({
      id: this.jobProfileId,
      $,
    });
    $.export("$summary", `Fetched job profile ${this.jobProfileId}`);
    return response;
  },
};
