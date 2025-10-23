import workday from "../../workday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "workday-delete-payroll-input",
  name: "Delete Payroll Input",
  description: "Delete a payroll input by ID. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#payroll/v2/delete-/payrollInputs/-ID-)",
  version: "0.0.1",
    annotations: {
        destructiveHint: true,
        openWorldHint: true,
        readOnlyHint: false,
    },
  type: "action",
  props: {
    workday,
    payrollInputId: {
      propDefinition: [workday, "payrollInputId"],
    },
  },
  async run({ $ }) {
    if (!this.payrollInputId || !this.payrollInputId.trim()) {
      throw new ConfigurationError("Payroll Input ID is required.");
    }
    const response = await this.workday.deletePayrollInput({
      id: this.payrollInputId,
      $,
    });
    $.export("$summary", `Payroll input ${this.payrollInputId} deleted`);
    return response;
  },
};
