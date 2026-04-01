import workday from "../../workday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "workday-update-payroll-input",
  name: "Update Payroll Input",
  description: "Update a payroll input. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#payroll/v2/patch-/payrollInputs/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    worker: {
      type: "object",
      label: "Worker",
      description: "The worker for this payroll input. Example: `{ \"id\": \"worker-id\", \"descriptor\": \"Worker Name\" }`",
      optional: true,
    },
    payComponent: {
      type: "object",
      label: "Pay Component",
      description: "The pay component for this payroll input. Example: `{ \"id\": \"component-id\", \"descriptor\": \"Comp Name\", \"code\": \"COMP01\" }`",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Effective start date. Example: `2012-01-01T08:00:00.000Z`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.payrollInputId || !this.payrollInputId.trim()) {
      throw new ConfigurationError("Payroll Input ID is required.");
    }

    const data = {};
    if (this.worker !== undefined) data.worker = this.worker;
    if (this.payComponent !== undefined) data.payComponent = this.payComponent;
    if (this.startDate !== undefined) data.startDate = this.startDate;

    if (Object.keys(data).length === 0) {
      throw new ConfigurationError("At least one field (worker, payComponent, startDate) must be provided to update.");
    }

    const response = await this.workday.updatePayrollInput({
      id: this.payrollInputId,
      data,
      $,
    });
    $.export("$summary", `Payroll input ${this.payrollInputId} successfully updated`);
    return response;
  },
};
