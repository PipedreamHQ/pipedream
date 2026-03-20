import workday from "../../workday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "workday-create-tax-rate",
  name: "Create Tax Rate",
  description: "Create a company tax rate. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#payroll/v2/post-/taxRates)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    workday,
    ein: {
      type: "string",
      label: "EIN",
      description: "Tax authority EIN field. Example: `664-8144-7`",
      optional: true,
    },
    taxCode: {
      type: "string",
      label: "Tax Code",
      description: "Tax deduction code. Example: `WL_SUIER`",
    },
    applicableRate: {
      type: "string",
      label: "Applicable Rate",
      description: "Tax rate override. Example: `9.9`",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date for company tax reporting. Example: `2018-12-31T08:00:00.000Z`",
      optional: true,
    },
    stateInstance: {
      type: "object",
      label: "State Instance",
      description: "Payroll tax authority object. Example: `{ \"id\": \"state-id\" }`",
    },
    companyInstance: {
      type: "object",
      label: "Company Instance",
      description: "Company object for tax reporting. Example: `{ \"id\": \"company-id\" }`",
      optional: true,
    },
    exempt: {
      type: "boolean",
      label: "Exempt",
      description: "True if SUI rate is exempt. Example: `true`",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date for company tax reporting. Example: `2008-01-01T08:00:00.000Z`",
    },
  },
  async run({ $ }) {
    if (this.stateInstance && (typeof this.stateInstance !== "object" || !this.stateInstance.id || !this.stateInstance.id.trim())) {
      throw new ConfigurationError("stateInstance is required to have a non-empty id property.");
    }
    if (!this.taxCode || !this.taxCode.trim()) {
      throw new ConfigurationError("Tax Code is required.");
    }
    if (!this.startDate || !this.startDate.trim()) {
      throw new ConfigurationError("Start Date is required.");
    }

    const data = {
      stateInstance: this.stateInstance,
      taxCode: this.taxCode,
      startDate: this.startDate,
    };
    if (this.applicableRate) data.applicableRate = this.applicableRate;
    if (this.endDate) data.endDate = this.endDate;
    if (this.ein) data.ein = this.ein;
    if (this.companyInstance) data.companyInstance = this.companyInstance;
    if (typeof this.exempt === "boolean") data.exempt = this.exempt;

    const response = await this.workday.createTaxRate({
      $,
      data,
    });
    $.export("$summary", "Tax rate created");
    return response;
  },
};
