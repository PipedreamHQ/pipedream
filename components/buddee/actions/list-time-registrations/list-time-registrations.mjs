import buddee from "../../buddee.app.mjs";

export default {
  name: "List Time Registrations",
  description: "Get all time tracking records, [See the documentation](https://developers.buddee.nl/#539c5261-c313-49ef-89d8-82b835b22cd4)",
  key: "buddee-list-time-registrations",
  version: "0.0.1",
  type: "action",
  props: {
    buddee,
    employeeId: {
      propDefinition: [
        buddee,
        "employeeId",
      ],
      description: "ID of the employee you want to filter on",
      optional: true,
    },
    companyId: {
      propDefinition: [
        buddee,
        "companyId",
      ],
      description: "ID of the company you want to filter on",
      optional: true,
    },
    departmentId: {
      propDefinition: [
        buddee,
        "departmentId",
      ],
      optional: true,
    },
    timeRegistrationTypeId: {
      propDefinition: [
        buddee,
        "timeRegistrationTypeId",
      ],
      optional: true,
    },
    projectId: {
      propDefinition: [
        buddee,
        "projectId",
      ],
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date of the time registration. Format: `YYYY-MM-DD`",
      optional: true,
    },
    isOvertime: {
      type: "boolean",
      label: "Is Overtime",
      description: "Whether the time registration is overtime",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.buddee.paginate({
      $,
      fn: this.buddee.getTimeRegistrations,
      maxResults: this.maxResults,
      params: {
        employee_id: this.employeeId,
        company_id: this.companyId,
        department_id: this.departmentId,
        time_registration_type_id: this.timeRegistrationTypeId,
        project_id: this.projectId,
        date: this.date,
        is_overtime: this.isOvertime,
      },
    });

    const responseArray = [];
    for await (const timeRegistration of response) {
      responseArray.push(timeRegistration);
    }

    $.export("$summary", `Found ${responseArray.length} time registrations`);
    return responseArray;
  },
};
