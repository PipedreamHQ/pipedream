import app from "../../deel.app.mjs";

export default {
  key: "deel-amend-eor-contract",
  name: "Amend EOR Contract",
  description:
    "Create a new amendment for an EOR (employer of record) Deel contract — change salary, currency,"
    + " job title, employment type, work hours, holidays, or notice period."
    + " All amendment fields are optional; provide only the fields you want to change."
    + " `effective_date` and `start_date` must be in ISO 8601 format (e.g., `2026-09-01`)."
    + " Use **List Contracts** to find the contract ID."
    + " [See the documentation](https://developer.deel.com/docs/amend-an-eor-contract)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contractId: {
      propDefinition: [
        app,
        "contractId",
      ],
    },
    effectiveDate: {
      type: "string",
      label: "Effective Date",
      description: "Date when the amendment takes effect, in ISO 8601 format (e.g., `2026-09-01`).",
    },
    salary: {
      type: "string",
      label: "New Salary",
      description: "New annual salary amount (e.g., `85000`).",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "ISO 4217 currency code for the new salary (e.g., `EUR`, `USD`).",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "New job title for the employee.",
      optional: true,
    },
    employmentType: {
      type: "string",
      label: "Employment Type",
      description: "New employment type (e.g., `full_time`, `part_time`).",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "New employment start date in ISO 8601 format.",
      optional: true,
    },
    holidays: {
      type: "integer",
      label: "Holidays (Days)",
      description: "New number of annual holiday days.",
      optional: true,
    },
    noticePeriod: {
      type: "integer",
      label: "Notice Period (Days)",
      description: "New notice period in days.",
      optional: true,
    },
    workHoursPerWeek: {
      type: "string",
      label: "Work Hours Per Week",
      description: "New weekly work hours (e.g., `40`).",
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = {
      effective_date: this.effectiveDate,
    };
    if (this.salary) payload.salary = parseFloat(this.salary);
    if (this.currency) payload.currency = this.currency;
    if (this.jobTitle) payload.job_title = this.jobTitle;
    if (this.employmentType) payload.employment_type = this.employmentType;
    if (this.startDate) payload.start_date = this.startDate;
    if (this.holidays !== undefined) payload.holidays = this.holidays;
    if (this.noticePeriod !== undefined) payload.notice_period = this.noticePeriod;
    if (this.workHoursPerWeek) payload.work_hours_per_week = parseFloat(this.workHoursPerWeek);

    const response = await this.app.amendContract($, this.contractId, payload);

    $.export("$summary", `Amended EOR contract ${this.contractId} effective ${this.effectiveDate}`);
    return response;
  },
};
