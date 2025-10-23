import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-pay-group-details",
  name: "List Pay Group Details",
  description: "List all pay group details. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#payroll/v2/get-/payGroupDetails)",
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
    const response = await this.workday.listPayGroupDetails({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} pay group details`);
    return response;
  },
};
