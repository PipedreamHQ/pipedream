import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-tax-rates",
  name: "List Tax Rates",
  description: "List all company tax rates. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#payroll/v2/get-/taxRates)",
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
    const response = await this.workday.listTaxRates({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} tax rates`);
    return response;
  },
};
