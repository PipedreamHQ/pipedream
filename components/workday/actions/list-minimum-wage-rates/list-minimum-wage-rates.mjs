import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-minimum-wage-rates",
  name: "List Minimum Wage Rates",
  description: "List all minimum wage rates. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#payroll/v2/get-/minimumWageRates)",
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
    const response = await this.workday.listMinimumWageRates({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} minimum wage rates`);
    return response;
  },
};
