import workday from "../../workday.app.mjs";
export default {
  key: "workday-list-job-families",
  name: "List Job Families",
  description: "List all job families. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#staffing/v7/get-/jobFamilies)",
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
    const response = await this.workday.listJobFamilies({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} job families`);
    return response;
  },
};
