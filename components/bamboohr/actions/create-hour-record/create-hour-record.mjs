import bamboohr from "../../bamboohr.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "bamboohr-create-hour-record",
  name: "Create Hour Record",
  description: "Add a single approved hour record to the legacy Hours API (POST /timetracking/add), separate from Time Tracking timesheets — use **Create Hour Entry** instead for timesheet-integrated hours. You choose the record's ID; save it to update or delete this record later with **Update Hour Record** / **Delete Hour Record**. [See the documentation](https://documentation.bamboohr.com/reference/create-time-tracking-hour-record)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  ai: "optimized",
  props: {
    bamboohr,
    recordId: {
      propDefinition: [
        bamboohr,
        "recordId",
      ],
      description: "A unique ID you choose for this record (up to 36 characters), e.g. `550e8400-e29b-41d4-a716-446655440000` (a UUID). Save it — you'll need it to update or delete this record later.",
    },
    employeeId: {
      propDefinition: [
        bamboohr,
        "employeeId",
      ],
    },
    dateHoursWorked: {
      type: "string",
      label: "Date Hours Worked",
      description: "The date the hours were worked, in YYYY-MM-DD format, e.g. `2026-09-01`.",
    },
    hoursWorked: {
      type: "string",
      label: "Hours Worked",
      description: "Number of hours worked as a decimal, e.g. `8` or `7.5`.",
    },
    rateType: {
      type: "string",
      label: "Rate Type",
      description: "The type of hours worked.",
      options: [
        "REG",
        "OT",
        "DT",
      ],
    },
    divisionId: {
      type: "string",
      label: "Division ID",
      description: "Optional numeric division ID, e.g. `1`. Company-specific; find valid IDs in your BambooHR payroll/company settings.",
      optional: true,
    },
    departmentId: {
      type: "string",
      label: "Department ID",
      description: "Optional numeric department ID, e.g. `2`. Company-specific; find valid IDs in your BambooHR payroll/company settings.",
      optional: true,
    },
    jobTitleId: {
      type: "string",
      label: "Job Title ID",
      description: "Optional numeric job title ID, e.g. `3`. Company-specific; find valid IDs in your BambooHR payroll/company settings.",
      optional: true,
    },
    payCode: {
      type: "string",
      label: "Pay Code",
      description: "Optional pay code; required by some payroll providers, e.g. `REG1`. Company-specific; check with your payroll provider or BambooHR admin.",
      optional: true,
    },
    payRate: {
      type: "string",
      label: "Pay Rate",
      description: "Optional hourly pay rate as a decimal, e.g. `15.00`.",
      optional: true,
    },
    jobCode: {
      type: "string",
      label: "Job Code",
      description: "Optional numeric job code, e.g. `100`. Company-specific; find valid codes in your BambooHR payroll/company settings.",
      optional: true,
    },
    jobData: {
      type: "string",
      label: "Job Data",
      description: "Up to four 20-character job numbers, comma-delimited, e.g. `JOB1,JOB2`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const toInt = (value, label) => {
      if (!value) {
        return undefined;
      }
      const parsed = Number(value);
      if (!Number.isInteger(parsed)) {
        throw new ConfigurationError(`${label} must be an integer, got \`${value}\``);
      }
      return parsed;
    };
    const toFloat = (value, label) => {
      if (!value) {
        return undefined;
      }
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) {
        throw new ConfigurationError(`${label} must be a valid number, got \`${value}\``);
      }
      return parsed;
    };
    const employeeId = toInt(this.employeeId, "Employee ID");
    const hoursWorked = toFloat(this.hoursWorked, "Hours Worked");
    const divisionId = toInt(this.divisionId, "Division ID");
    const departmentId = toInt(this.departmentId, "Department ID");
    const jobTitleId = toInt(this.jobTitleId, "Job Title ID");
    const payRate = toFloat(this.payRate, "Pay Rate");
    const jobCode = toInt(this.jobCode, "Job Code");
    const response = await this.bamboohr.createHourRecord({
      $,
      data: {
        timeTrackingId: this.recordId,
        employeeId,
        dateHoursWorked: this.dateHoursWorked,
        hoursWorked,
        rateType: this.rateType,
        divisionId,
        departmentId,
        jobTitleId,
        payCode: this.payCode,
        payRate,
        jobCode,
        jobData: this.jobData,
      },
    });
    $.export("$summary", `Created hour record ${this.recordId} for employee ${this.employeeId}`);
    return response;
  },
};
