import workday from "../../workday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "workday-create-payroll-input",
  name: "Create Payroll Input",
  description: "Creates a payroll input instance. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#payroll/v2/post-/payrollInputs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    workday,
    worker: {
      type: "object",
      label: "Worker",
      description: "The worker for this payroll input. Example: `{ \"id\": \"worker-id\", \"descriptor\": \"Worker Name\" }`",
    },
    payComponent: {
      type: "object",
      label: "Pay Component",
      description: "The pay component for this payroll input. Example: `{ \"id\": \"component-id\", \"descriptor\": \"Comp Name\", \"code\": \"COMP01\" }`",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Effective start date. Example: `2012-01-01T08:00:00.000Z`",
    },
  },
  async run({ $ }) {
    if (!this.worker || typeof this.worker !== "object" || !this.worker.id) {
      throw new ConfigurationError("worker (object with non-empty id) is required.");
    }
    if (!this.payComponent || typeof this.payComponent !== "object" || !this.payComponent.id) {
      throw new ConfigurationError("payComponent (object with non-empty id) is required.");
    }
    if (!this.startDate || !this.startDate.trim()) {
      throw new ConfigurationError("startDate is required and cannot be empty.");
    }

    const data = {
      worker: this.worker,
      payComponent: this.payComponent,
      startDate: this.startDate,
    };

    const response = await this.workday.createPayrollInput({
      $,
      data,
    });
    $.export("$summary", "Payroll input Successfully created");
    return response;
  },
};
