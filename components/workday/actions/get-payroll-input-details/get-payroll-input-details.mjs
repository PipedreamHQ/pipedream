import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-payroll-input-details",
  name: "Get Payroll Input Details",
  description: "Get details of a payroll input by ID. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#payroll/v2/get-/payrollInputs/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    payrollInputId: {
      propDefinition: [
        workday,
        "payrollInputId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workday.getPayrollInput({
      id: this.payrollInputId,
      $,
    });
    $.export("$summary", `Fetched details for payroll input ID ${this.payrollInputId}`);
    return response;
  },
};
