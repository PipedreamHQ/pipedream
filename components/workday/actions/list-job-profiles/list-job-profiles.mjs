import workday from "../../workday.app.mjs";
export default {
  key: "workday-list-job-profiles",
  name: "List Job Profiles",
  description: "List all job profiles. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#staffing/v7/get-/jobProfiles)",
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
    const response = await this.workday.listJobProfiles({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} job profiles`);
    return response;
  },
};
