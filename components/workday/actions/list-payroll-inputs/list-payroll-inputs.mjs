import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-payroll-inputs",
  name: "List Payroll Inputs",
  description: "List all payroll inputs. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#payroll/v2/get-/payrollInputs)",
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
    const response = await this.workday.listPayrollInputs({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} payroll inputs`);
    return response;
  },
};
