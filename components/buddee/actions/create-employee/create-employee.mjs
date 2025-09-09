import buddee from "../../buddee.app.mjs";

export default {
  name: "Create Employee",
  description: "Create a new employee record. [See the documentation](https://developers.buddee.nl/#d08b1399-6333-4f08-a17b-26b2d8485d7e)",
  key: "createEmployee",
  version: "0.0.1",
  type: "action",
  props: {
    buddee,
    companyId: {
      propDefinition: [
        buddee,
        "companyId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Employee's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Employee's last name",
    },
    employmentDate: {
      type: "string",
      label: "Employment Date",
      description: "Employee's employment date (YYYY-MM-DD)",
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
    costCenterId: {
      propDefinition: [
        buddee,
        "costCenterId",
      ],
      optional: true,
    },
    costUnitId: {
      propDefinition: [
        buddee,
        "costUnitId",
      ],
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "The gender of the employee",
      optional: true,
    },
    birthDate: {
      type: "string",
      label: "Birth Date",
      description: "The birth date of the employee (YYYY-MM-DD)",
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
  },
  async run({ $ }) {
    const response = await this.buddee.createEmployee({
      $,
      data: {
        company_id: this.companyId,
        first_name: this.firstName,
        last_name: this.lastName,
        employment_date: this.employmentDate,
        manager_id: this.managerId,
        indirect_manager_id: this.indirectManagerId,
        cost_center_id: this.costCenterId,
        cost_unit_id: this.costUnitId,
        gender: this.gender,
        birth_date: this.birthDate,
        work_email: this.workEmail,
        personal_email: this.personalEmail,
      },
    });

    $.export("$summary", `Successfully created employee with ID ${response.data.id}`);
    return response.data;
  },
};
