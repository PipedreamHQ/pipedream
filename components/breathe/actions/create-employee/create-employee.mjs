import breathe from "../../breathe.app.mjs";

export default {
  key: "breathe-create-employee",
  name: "Create Employee",
  description: "Creates a new employee in Breathe. [See the documentation](https://developer.breathehr.com/examples#!/employees/POST_version_employees_json)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    breathe,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the employee",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the employee",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the employee",
    },
    companyJoinDate: {
      type: "string",
      label: "Company Join Date",
      description: "The date that the employee joined the company. Example: `2023-12-25`",
    },
    dob: {
      type: "string",
      label: "Date of Birth",
      description: "The date of birth of the employee",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The job title of the employee",
      optional: true,
    },
    departmentId: {
      propDefinition: [
        breathe,
        "departmentId",
      ],
    },
    divisionId: {
      propDefinition: [
        breathe,
        "divisionId",
      ],
    },
    locationId: {
      propDefinition: [
        breathe,
        "locationId",
      ],
    },
    workingPatternId: {
      propDefinition: [
        breathe,
        "workingPatternId",
      ],
    },
    holidayAllowanceId: {
      propDefinition: [
        breathe,
        "holidayAllowanceId",
      ],
    },
    workMobile: {
      type: "string",
      label: "Work Mobile",
      description: "The work moblie phone number of the employee",
      optional: true,
    },
    personalMobile: {
      type: "string",
      label: "Personal Mobile",
      description: "The personal mobile phone number of the employee",
      optional: true,
    },
    homeTelephone: {
      type: "string",
      label: "Home Telephone",
      description: "The home telephone number of the employee",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.breathe.createEmployee({
      $,
      data: {
        employee: {
          person_type: "Employee",
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          company_join_date: this.companyJoinDate,
          dob: this.dob,
          job_title: this.jobTitle,
          work_mobile: this.workMobile,
          personal_mobile: this.personalMobile,
          home_telephone: this.homeTelephone,
          department: this.departmentId,
          division: this.divisionId,
          location: this.locationId,
          working_pattern: this.workingPatternId,
          holiday_allowance: this.holidayAllowanceId,
        },
      },
    });
    $.export("$summary", `Successfully created employee with ID: ${response.employees[0].id}`);
    return response;
  },
};
