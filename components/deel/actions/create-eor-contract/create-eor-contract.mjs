import { ConfigurationError } from "@pipedream/platform";
import app from "../../deel.app.mjs";

export default {
  key: "deel-create-eor-contract",
  name: "Create EOR Contract",
  description:
    "Create an EOR (employer of record) contract quote in Deel to hire a full-time employee in a"
    + " country where your company doesn't have a legal entity."
    + " Use **Get EOR Hiring Guide** first to understand mandatory fields and compliance requirements"
    + " for the target country."
    + " `employee_nationality` and `employment_country` must be ISO 3166-1 alpha-2 codes (e.g., `DE`, `US`)."
    + " `employment_type` must be one of: `Full-time`, `Part-time`."
    + " `seniority_id` is a numeric seniority level: `1`=Junior, `2`=Mid, `3`=Senior, `4`=Lead,"
    + " `5`=Principal/Staff, `6`=Director, `7`=Head of Dept, `8`=VP, `9`=SVP, `34`=Not applicable."
    + " `scope_of_work` must be at least 100 characters long."
    + " [See the documentation](https://developer.deel.com/docs/create-an-eor-contract)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    clientTeamId: {
      propDefinition: [
        app,
        "clientTeamId",
      ],
    },
    clientLegalEntityId: {
      propDefinition: [
        app,
        "clientLegalEntityId",
      ],
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The employee's job title (e.g., `Paleobotanist`, `Software Engineer`).",
    },
    seniorityId: {
      type: "integer",
      label: "Seniority ID",
      description: "Numeric seniority level: `1`=Junior, `2`=Mid, `3`=Senior, `4`=Lead, `5`=Principal/Staff, `6`=Director, `7`=Head of Dept, `8`=VP, `9`=SVP, `34`=Not applicable.",
      optional: true,
    },
    employeeFirstName: {
      type: "string",
      label: "Employee First Name",
      description: "The employee's first (given) name.",
    },
    employeeLastName: {
      type: "string",
      label: "Employee Last Name",
      description: "The employee's last (family) name.",
    },
    employeeEmail: {
      type: "string",
      label: "Employee Email",
      description: "The employee's personal email address.",
    },
    employeeNationality: {
      type: "string",
      label: "Employee Nationality",
      description: "ISO 3166-1 alpha-2 country code of the employee's nationality (e.g., `DE`, `US`).",
    },
    employmentCountry: {
      type: "string",
      label: "Employment Country",
      description: "ISO 3166-1 alpha-2 country code where the employee will work (e.g., `DE`, `US`).",
    },
    employmentType: {
      type: "string",
      label: "Employment Type",
      description: "One of: `Full-time`, `Part-time`.",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The employment start date in ISO 8601 format (e.g., `2026-09-01`).",
    },
    scopeOfWork: {
      type: "string",
      label: "Scope of Work",
      description: "Description of the employee's role and responsibilities. Must be at least 100 characters long.",
    },
    workVisaRequired: {
      type: "boolean",
      label: "Work Visa Required",
      description: "Set to `true` if the employee requires a work visa. Default: `false`.",
      optional: true,
    },
    probationPeriodDays: {
      type: "integer",
      label: "Probation Period (Days)",
      description: "Probation period in days (e.g., `0`, `30`, `90`). Required for some countries.",
      optional: true,
    },
    compensationCurrency: {
      type: "string",
      label: "Compensation Currency",
      description: "ISO 4217 currency code for compensation (e.g., `EUR`, `USD`).",
    },
    compensationSalary: {
      type: "string",
      label: "Annual Salary",
      description: "Annual salary amount (e.g., `80000`). Provide this or `Hourly Rate`, not both.",
      optional: true,
    },
    compensationHourlyRate: {
      type: "string",
      label: "Hourly Rate",
      description: "Hourly rate amount. Provide this or `Annual Salary`, not both.",
      optional: true,
    },
  },
  async run({ $ }) {
    const employment = {
      country: this.employmentCountry,
      start_date: this.startDate,
      scope_of_work: this.scopeOfWork,
      work_visa_required: this.workVisaRequired ?? false,
    };
    if (this.employmentType) employment.type = this.employmentType;
    employment.probation_period = this.probationPeriodDays ?? 0;

    const payload = {
      job_title: this.jobTitle,
      client: {
        team: {
          id: this.clientTeamId,
        },
        legal_entity: {
          id: this.clientLegalEntityId,
        },
      },
      employee: {
        first_name: this.employeeFirstName,
        last_name: this.employeeLastName,
        nationality: this.employeeNationality,
        email: this.employeeEmail,
      },
      employment,
      compensation_details: {
        currency: this.compensationCurrency,
      },
    };

    if (this.seniorityId) {
      payload.seniority = {
        id: this.seniorityId,
      };
    }

    const hasSalary = this.compensationSalary != null && this.compensationSalary !== "";
    const hasHourly = this.compensationHourlyRate != null && this.compensationHourlyRate !== "";
    if (hasSalary && hasHourly) {
      throw new ConfigurationError("Provide either Annual Salary or Hourly Rate, not both.");
    }
    if (!hasSalary && !hasHourly) {
      throw new ConfigurationError("Provide either Annual Salary or Hourly Rate.");
    }
    if (hasSalary) {
      const salary = parseFloat(this.compensationSalary);
      if (!Number.isFinite(salary)) throw new ConfigurationError(`Invalid Annual Salary: "${this.compensationSalary}" is not a finite number`);
      payload.compensation_details.salary = salary;
    }
    if (hasHourly) {
      const hourlyRate = parseFloat(this.compensationHourlyRate);
      if (!Number.isFinite(hourlyRate)) throw new ConfigurationError(`Invalid Hourly Rate: "${this.compensationHourlyRate}" is not a finite number`);
      payload.compensation_details.hourly_rate = hourlyRate;
    }

    const response = await this.app._makeRequest({
      $,
      path: "/eor",
      method: "POST",
      data: {
        data: payload,
      },
    });

    const contract = response?.data ?? response;
    const contractId = contract?.id ?? "unknown";
    $.export("$summary", `Created EOR contract quote ${contractId} for ${this.employeeFirstName} ${this.employeeLastName} in ${this.employmentCountry}`);
    return response;
  },
};
