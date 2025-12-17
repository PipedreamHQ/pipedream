import buddee from "../../buddee.app.mjs";
import {
  CONTRACT_DURATION_OPTIONS, CONTRACT_TYPE_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  WORK_SCHEDULE_TYPE_OPTIONS,
} from "../../common/constants.mjs";

export default {
  name: "List Employees",
  description: "Retrieve a complete list of employees. [See the documentation](https://developers.buddee.nl/#fd057d3c-8b40-4808-a4d2-eeffc5da82d7)",
  key: "buddee-list-employees",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    buddee,
    jobId: {
      propDefinition: [
        buddee,
        "jobId",
      ],
      description: "Filter employees by job ID",
      optional: true,
    },
    locationId: {
      propDefinition: [
        buddee,
        "locationId",
      ],
      description: "Filter employees by location ID",
      optional: true,
    },
    buddyId: {
      propDefinition: [
        buddee,
        "employeeId",
      ],
      label: "Buddy ID",
      description: "Filter employees by buddy ID",
      optional: true,
    },
    managerId: {
      propDefinition: [
        buddee,
        "employeeId",
      ],
      label: "Manager ID",
      description: "Filter employees by manager ID",
      optional: true,
    },
    indirectManagerId: {
      propDefinition: [
        buddee,
        "employeeId",
      ],
      label: "Indirect Manager ID",
      description: "Filter employees by indirect manager ID",
      optional: true,
    },
    hrManagerId: {
      propDefinition: [
        buddee,
        "employeeId",
      ],
      label: "HR Manager ID",
      description: "Filter employees by HR manager ID",
      optional: true,
    },
    costCenterId: {
      propDefinition: [
        buddee,
        "costCenterId",
      ],
      description: "Filter employees by cost center ID",
      optional: true,
    },
    costUnitId: {
      propDefinition: [
        buddee,
        "costUnitId",
      ],
      description: "Filter employees by cost unit ID",
      optional: true,
    },
    fullName: {
      type: "string",
      label: "Full Name",
      description: "Filter employees by full name",
      optional: true,
    },
    workEmail: {
      type: "string",
      label: "Work Email",
      description: "Filter employees by work email address",
      optional: true,
    },
    personalEmail: {
      type: "string",
      label: "Personal Email",
      description: "Filter employees by personal email address",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Filter by active or archived employees based on the boolean value",
      optional: true,
    },
    employedOrArchivedInPeriod: {
      type: "string",
      label: "Employed or Archived in Period",
      description: "Filter employees employed or archived within a specified date range",
      optional: true,
    },
    activeInPeriod: {
      type: "string",
      label: "Active in Period",
      description: "Filter employees active within a specific period",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Filter employees by archived status",
      optional: true,
    },
    contractDuration: {
      type: "string",
      label: "Contract Duration",
      description: "Filter employees by the duration of their contract",
      options: CONTRACT_DURATION_OPTIONS,
      optional: true,
    },
    contractType: {
      type: "string",
      label: "Contract Type",
      description: "Filter employees by the type of contract",
      options: CONTRACT_TYPE_OPTIONS,
      optional: true,
    },
    employmentType: {
      type: "string",
      label: "Employment Type",
      description: "Filter employees by the type of employment",
      options: EMPLOYMENT_TYPE_OPTIONS,
      optional: true,
    },
    manager: {
      propDefinition: [
        buddee,
        "employeeId",
      ],
      label: "Manager ID",
      description: "Filter employees by manager ID",
      optional: true,
    },
    workScheduleType: {
      type: "string",
      label: "Work Schedule Type",
      description: "Filter employees by the type of work schedule",
      options: WORK_SCHEDULE_TYPE_OPTIONS,
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
      fn: this.buddee.getEmployees,
      maxResults: this.maxResults,
      params: {
        job_id: this.jobId,
        location_id: this.locationId,
        buddy_id: this.buddyId,
        manager_id: this.managerId,
        indirect_manager_id: this.indirectManagerId,
        hr_manager_id: this.hrManagerId,
        cost_center_id: this.costCenterId,
        cost_unit_id: this.costUnitId,
        full_name: this.fullName,
        work_email: this.workEmail,
        personal_email: this.personalEmail,
        active: this.active,
        employed_or_archived_in_period: this.employedOrArchivedInPeriod,
        active_in_period: this.activeInPeriod,
        archived: this.archived,
        contract_duration: this.contractDuration,
        contract_type: this.contractType,
        employment_type: this.employmentType,
        manager: this.manager,
        work_schedule_type: this.workScheduleType,
      },
    });

    const responseArray = [];
    for await (const employee of response) {
      responseArray.push(employee);
    }

    $.export("$summary", `Found ${responseArray.length} employees`);
    return responseArray;
  },
};
