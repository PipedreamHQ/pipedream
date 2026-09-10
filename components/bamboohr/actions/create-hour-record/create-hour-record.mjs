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
  props: {
    bamboohr,
    recordId: {
      propDefinition: [
        bamboohr,
        "recordId",
      ],
      description: "A unique ID you choose for this record (up to 36 characters, e.g. a UUID). Save it — you'll need it to update or delete this record later.",
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
      description: "Optional division ID.",
      optional: true,
    },
    departmentId: {
      type: "string",
      label: "Department ID",
      description: "Optional department ID.",
      optional: true,
    },
    jobTitleId: {
      type: "string",
      label: "Job Title ID",
      description: "Optional job title ID.",
      optional: true,
    },
    payCode: {
      type: "string",
      label: "Pay Code",
      description: "Optional pay code; required by some payroll providers.",
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
      description: "Optional job code.",
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
    let jobCode;
    if (this.jobCode) {
      jobCode = Number(this.jobCode);
      if (!Number.isInteger(jobCode)) {
        throw new ConfigurationError(`Job Code must be an integer, got \`${this.jobCode}\``);
      }
    }
    const response = await this.bamboohr.createHourRecord({
      $,
      data: {
        timeTrackingId: this.recordId,
        employeeId: parseInt(this.employeeId, 10),
        dateHoursWorked: this.dateHoursWorked,
        hoursWorked: parseFloat(this.hoursWorked),
        rateType: this.rateType,
        divisionId: this.divisionId
          ? parseInt(this.divisionId, 10)
          : undefined,
        departmentId: this.departmentId
          ? parseInt(this.departmentId, 10)
          : undefined,
        jobTitleId: this.jobTitleId
          ? parseInt(this.jobTitleId, 10)
          : undefined,
        payCode: this.payCode,
        payRate: this.payRate
          ? parseFloat(this.payRate)
          : undefined,
        jobCode,
        jobData: this.jobData,
      },
    });
    $.export("$summary", `Created hour record ${this.recordId} for employee ${this.employeeId}`);
    return response;
  },
};
