import { ConfigurationError } from "@pipedream/platform";
import app from "../../deel.app.mjs";

export default {
  key: "deel-create-gp-contract",
  name: "Create Global Payroll Contract",
  description:
    "Create a Global Payroll (GP) contract in Deel to add an employee to your domestic payroll system."
    + " Use this when the employee works in a country where your company already has a legal entity."
    + " `employment_type` must be one of: `Full-time`, `Part-time` (case-sensitive)."
    + " `compensation_scale` must be one of: `YEAR`, `MONTH` (uppercase)."
    + " `address_country` must be an ISO 3166-1 alpha-2 code (e.g., `US`, `DE`)."
    + " `client_team_id` and `client_legal_entity_id` are required — retrieve from your Deel organization settings."
    + " For US-based employees: `work_location_state` (2-letter state code, e.g., `OR`), `work_location_is_wfh`, and (if not WFH) `work_location_name` (office name) are required."
    + " [See the documentation](https://developer.deel.com/docs/create-a-gp-contract)",
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
      description: "The employee's job title (e.g., `Software Engineer`).",
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
      label: "Employee Personal Email",
      description: "The employee's personal email address (e.g., `jane.doe@gmail.com`).",
    },
    employeeWorkEmail: {
      type: "string",
      label: "Employee Work Email",
      description: "The employee's work email address.",
    },
    addressStreet: {
      type: "string",
      label: "Street Address",
      description: "The employee's street address.",
    },
    addressCity: {
      type: "string",
      label: "City",
      description: "The employee's city.",
    },
    addressZip: {
      type: "string",
      label: "ZIP/Postal Code",
      description: "The employee's ZIP or postal code.",
    },
    addressCountry: {
      type: "string",
      label: "Country",
      description: "ISO 3166-1 alpha-2 country code of the employee's address (e.g., `US`, `DE`).",
    },
    employmentType: {
      type: "string",
      label: "Employment Type",
      description: "One of: `Full-time`, `Part-time` (case-sensitive).",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The employment start date in ISO 8601 format (e.g., `2026-09-01`).",
    },
    holidaysAllowance: {
      type: "integer",
      label: "Holidays Allowance (Days)",
      description: "Number of annual holiday days.",
    },
    holidaysStartDate: {
      type: "string",
      label: "Holidays Start Date",
      description: "The date from which holiday allowance accrues, in ISO 8601 format.",
    },
    compensationSalary: {
      type: "string",
      label: "Salary Amount",
      description: "The salary amount per the chosen compensation scale (e.g., `95000` for annual).",
    },
    compensationScale: {
      type: "string",
      label: "Compensation Scale",
      description: "Pay period for the salary. One of: `YEAR`, `MONTH` (uppercase).",
    },
    compensationCurrency: {
      type: "string",
      label: "Currency",
      description: "ISO 4217 currency code for the salary (e.g., `USD`, `EUR`).",
    },
    workLocationState: {
      type: "string",
      label: "Work Location State",
      description: "2-letter US state code for the employee's work location (e.g., `OR`, `CA`). Required for US employees.",
      optional: true,
    },
    workLocationIsWfh: {
      type: "boolean",
      label: "Work From Home",
      description: "Whether the employee works from home. Set to `true` for remote employees. Required for US employees.",
      optional: true,
    },
    workLocationName: {
      type: "string",
      label: "Work Location Name",
      description: "Name of the office location (e.g., `Springfield HQ`). Required when `Work From Home` is `false` for US employees.",
      optional: true,
    },
  },
  async run({ $ }) {
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
        email: this.employeeEmail,
        work_email: this.employeeWorkEmail,
        address: {
          street: this.addressStreet,
          city: this.addressCity,
          zip: this.addressZip,
          country: this.addressCountry,
        },
      },
      employment: {
        type: this.employmentType,
        start_date: this.startDate,
        holidays: {
          allowance: this.holidaysAllowance,
          start_date: this.holidaysStartDate,
        },
      },
      compensation_details: {
        salary: parseFloat(this.compensationSalary),
        scale: this.compensationScale,
        currency: this.compensationCurrency,
      },
    };

    if (this.addressCountry === "US") {
      if (this.workLocationState == null) throw new ConfigurationError("work_location_state is required for US employees.");
      if (this.workLocationIsWfh == null) throw new ConfigurationError("work_location_is_wfh is required for US employees.");
      if (this.workLocationIsWfh === false && !this.workLocationName) {
        throw new ConfigurationError("work_location_name is required for US employees when work_location_is_wfh is false.");
      }
    }
    if (this.workLocationState != null || this.workLocationIsWfh != null) {
      payload.work_location = {
        country: this.addressCountry,
        state: this.workLocationState,
        is_wfh: this.workLocationIsWfh ?? false,
      };
      if (this.workLocationName) payload.work_location.name = this.workLocationName;
    }

    const response = await this.app.createGpContract($, payload);

    const contract = response?.data ?? response;
    const contractId = contract?.id ?? "unknown";
    $.export("$summary", `Created GP contract ${contractId} for ${this.employeeFirstName} ${this.employeeLastName}`);
    return response;
  },
};
