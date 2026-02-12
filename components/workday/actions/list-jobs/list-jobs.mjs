import workday from "../../workday.app.mjs";
export default {
  key: "workday-list-jobs",
  name: "List Jobs",
  description: "List all jobs. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#staffing/v7/get-/jobs)",
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
    const response = await this.workday.listJobs({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} jobs`);
    return response;
  },
};
