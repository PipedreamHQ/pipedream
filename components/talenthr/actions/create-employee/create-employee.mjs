import {
  OVERTIME_STATUS,
  PAY_RATE_PERIOD_OPTIONS,
  PAY_RATE_SCHEDULE_OPTIONS,
} from "../../common/constants.mjs";
import talenthr from "../../talenthr.app.mjs";

export default {
  key: "talenthr-create-employee",
  name: "Create Employee",
  description: "Hires a new employee and registers them in the system. [See the documentation](https://apidocs.talenthr.io/#2950f0ba-b27b-4d4b-855f-4b79b667767c)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    talenthr,
    firstName: {
      propDefinition: [
        talenthr,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        talenthr,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        talenthr,
        "email",
      ],
    },
    hireDate: {
      propDefinition: [
        talenthr,
        "hireDate",
      ],
    },
    employmentStatusId: {
      propDefinition: [
        talenthr,
        "employmentStatusId",
      ],
    },
    reportsToEmployeeId: {
      propDefinition: [
        talenthr,
        "employeeId",
      ],
      optional: true,
    },
    jobTitleId: {
      propDefinition: [
        talenthr,
        "jobTitleId",
      ],
      optional: true,
    },
    jobLocationId: {
      propDefinition: [
        talenthr,
        "jobLocationId",
      ],
      optional: true,
    },
    divisionId: {
      propDefinition: [
        talenthr,
        "divisionId",
      ],
      optional: true,
    },
    departmentId: {
      propDefinition: [
        talenthr,
        "departmentId",
      ],
      optional: true,
    },
    payRate: {
      type: "string",
      label: "Pay Rate",
      description: "Employee's wage and must have 2 decimals. E.g 1255.38",
    },
    payRatePeriod: {
      type: "string",
      label: "Pay Rate Period",
      description: "The period over which money is earned.",
      options: PAY_RATE_PERIOD_OPTIONS,
    },
    payRateSchedule: {
      type: "string",
      label: "Pay Rate Schedule",
      description: "Frequency of the wage.",
      options: PAY_RATE_SCHEDULE_OPTIONS,
      optional: true,
    },
    overtimeStatus: {
      type: "string",
      label: "Overtime Status",
      description: "Determining whether an employee is exempt or non-exempt from overtime regulations.",
      options: OVERTIME_STATUS,
      optional: true,
    },
    preventEmail: {
      type: "boolean",
      label: "Prevent Email",
      description: "Opt for 'true', if you don't want to send an invitation email to the hiring employee, else 'false'.",
      optional: true,
    },
    isExisting: {
      type: "boolean",
      label: "Is Existing",
      description: "Opt for 'false' if the employee is a new hire and you want to run the Automatic Onboarding process, else 'true'.",
      optional: true,
    },
    whoId: {
      type: "integer",
      label: "Who ID",
      description: "The employee who will meet the newly hired employee. Required if **When Time** and address is present.",
      optional: true,
    },
    address: {
      propDefinition: [
        talenthr,
        "address",
      ],
      optional: true,
    },
    whenTime: {
      type: "string",
      label: "When Time",
      description: "The date time that the meeting will take place. Required if **Who ID** and address is present. The hire date must be formatted as 'YYYY-MM-DD HH:II'.",
      optional: true,
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "Important Instructions for the newly hired employee.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.talenthr.createEmployee({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        hire_date: this.hireDate,
        employment_status: {
          employment_status_id: this.employmentStatusId,
        },
        reports_to_employee_id: this.reportsToEmployeeId,
        job_record: {
          job_title_id: this.jobTitleId,
          location_id: this.jobLocationId,
          division_id: this.divisionId,
          department_id: this.departmentId,
        },
        compensation_record: {
          pay_rate: parseFloat(this.payRate),
          pay_rate_period: this.payRatePeriod,
          pay_rate_schedule: this.payRateSchedule,
          overtime_status: this.overtimeStatus,
        },
        prevent_email: this.preventEmail,
        is_existing: this.isExisting,
        hire_packet: {
          who_id: this.whoId,
          address: this.address,
          when_time: this.whenTime,
          instructions: this.instrwuctions,
        },
      },
    });

    $.export("$summary", `Successfully created employee: ${response.data.id}`);
    return response;
  },
};
