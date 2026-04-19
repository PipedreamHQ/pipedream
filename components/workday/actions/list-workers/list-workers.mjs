import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-workers",
  name: "List Workers",
  description: "List all workers.[See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#staffing/v7/get-/workers)",
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
    const response = await this.workday.listWorkers({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} workers`);
    return response;
  },
};
