import buddee from "../../buddee.app.mjs";

export default {
  name: "Create Employee",
  description: "Create a new employee record. [See the documentation](https://developers.buddee.nl/#d08b1399-6333-4f08-a17b-26b2d8485d7e)",
  key: "buddee-create-employee",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    buddee,
    companyId: {
      propDefinition: [
        buddee,
        "companyId",
      ],
    },
    employmentDate: {
      type: "string",
      label: "Employment Date",
      description: "Employee's employment date (Format: YYYY-MM-DD)",
    },
    firstDayAtWorkDate: {
      type: "string",
      label: "First Day at Work Date",
      description: "Employee's first day at work date (Format: YYYY-MM-DD)",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Employee's first name",
    },
    initials: {
      type: "string",
      label: "Initials",
      description: "Employee's initials",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Employee's last name",
    },
    lastNamePrefix: {
      type: "string",
      label: "Last Name Prefix",
      description: "Employee's last name prefix",
      optional: true,
    },
    workEmail: {
      type: "string",
      label: "Work Email",
      description: "The work email of the employee",
      optional: true,
    },
    personalEmail: {
      type: "string",
      label: "Personal Email",
      description: "The personal email of the employee",
      optional: true,
    },
    managerId: {
      propDefinition: [
        buddee,
        "employeeId",
      ],
      label: "Manager ID",
      description: "The ID of the manager to create the employee for",
      optional: true,
    },
    indirectManagerId: {
      propDefinition: [
        buddee,
        "employeeId",
      ],
      label: "Indirect Manager ID",
      description: "The ID of the indirect manager to create the employee for",
      optional: true,
    },
    hrManagerId: {
      propDefinition: [
        buddee,
        "employeeId",
      ],
      label: "HR Manager ID",
      description: "The ID of the HR manager to create the employee for",
      optional: true,
    },
    buddyId: {
      propDefinition: [
        buddee,
        "employeeId",
      ],
      label: "Buddee ID",
      description: "A buddy is an existing employee who guides the new employee through the first few weeks or months on the job.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.buddee.createEmployee({
      $,
      data: {
        company_id: this.companyId,
        employment_date: this.employmentDate,
        first_day_at_work_date: this.firstDayAtWorkDate,
        first_name: this.firstName,
        initials: this.initials,
        last_name: this.lastName,
        last_name_prefix: this.lastNamePrefix,
        work_email: this.workEmail,
        personal_email: this.personalEmail,
        manager_id: this.managerId,
        indirect_manager_id: this.indirectManagerId,
        hr_manager_id: this.hrManagerId,
        buddy_id: this.buddyId,
      },
    });

    $.export("$summary", `Successfully created employee with ID ${response.data.id}`);
    return response.data;
  },
};
