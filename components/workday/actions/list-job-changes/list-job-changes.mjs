import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-job-changes",
  name: "List Job Changes",
  description: "Retrieve a list of all job changes. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#staffing/v7/jobChanges)",
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
    const response = await this.workday.listJobChanges({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} job changes`);
    return response;
  },
};
