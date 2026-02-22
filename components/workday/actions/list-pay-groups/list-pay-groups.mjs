import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-pay-groups",
  name: "List Pay Groups",
  description: "List all pay groups. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#payroll/v2/get-/payGroups)",
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
    const response = await this.workday.listPayGroups({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} pay groups`);
    return response;
  },
};
