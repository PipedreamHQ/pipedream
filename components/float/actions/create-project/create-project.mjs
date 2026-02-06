import {
  cleanObject,
  parseObject,
} from "../../common/utils.mjs";
import float from "../../float.app.mjs";
import {
  BUDGET_PRIORITY_OPTIONS,
  BUDGET_TYPE_OPTIONS,
  PROJECT_STATUS_OPTIONS,
} from "../common/constants.mjs";

export default {
  key: "float-create-project",
  name: "Create Project",
  description: "Create a new project. [See the documentation](https://developer.float.com/tutorial_managing_your_projects.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    float,
    name: {
      type: "string",
      label: "Project Name",
      description: "Name of the project",
    },
    projectCode: {
      type: "string",
      label: "Project Code",
      description: "An optional third-party identifier unique across all projects enforced using case-insensitive comparison",
      optional: true,
    },
    clientId: {
      propDefinition: [
        float,
        "clientId",
      ],
      description: "Client to associate with the project",
      optional: true,
    },
    color: {
      type: "string",
      label: "Color",
      description: "Project's color in hexadecimal (e.g. FF2D00)",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes for this project",
      optional: true,
    },
    tags: {
      propDefinition: [
        float,
        "tags",
      ],
      optional: true,
    },
    budgetType: {
      type: "integer",
      label: "Budget Type",
      description: "Is there a project budget?",
      options: BUDGET_TYPE_OPTIONS,
      optional: true,
    },
    budgetTotal: {
      type: "integer",
      label: "Budget Total",
      description: "The budget amount for Total hours or Total fee project budgets. Displays as null for Hourly fee, Phase and Task budgets, also see `Budget Priority`",
      optional: true,
    },
    budgetPriority: {
      type: "string",
      label: "Budget Priority",
      description: "Defines which level the budget will be determined from. For non-project levels, the total budget can be calculated from the sum of budgets in each Phase or Task",
      options: BUDGET_PRIORITY_OPTIONS,
      optional: true,
    },
    defaultHourlyRate: {
      type: "string",
      label: "Default Hourly Rate",
      description: "The default hourly rate for fee-based budgets, the request also accepts a decimal `number`",
      optional: true,
    },
    nonBillable: {
      type: "boolean",
      label: "Non-Billable",
      description: "Is this project billable?",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the project. If both `Status` and `Stage ID` are provided, `Stage ID` takes precedence. If only `Status` is provided, the first available stage for that status will be automatically selected",
      options: PROJECT_STATUS_OPTIONS,
      optional: true,
    },
    stageId: {
      propDefinition: [
        float,
        "stageId",
      ],
      optional: true,
    },
    lockedTaskList: {
      type: "boolean",
      label: "Locked Task List",
      description: "Are members locked from adding project tasks (Only Project Managers can add to this list)?",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Is this project active or archived?",
      optional: true,
    },
    projectManagerId: {
      propDefinition: [
        float,
        "accountId",
      ],
      optional: true,
    },
    allPmsSchedule: {
      type: "boolean",
      label: "All PMs Schedule",
      description: "Do all project managers have scheduling rights?",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of this project which is either manually set or calculated from the earliest phase, milestone, allocation, or logged time. (format: `YYYY-MM-DD`)",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of this project which is either manually set or calculated from the latest phase, milestone, allocation, or logged time. (format: `YYYY-MM-DD`)",
      optional: true,
    },
    expenses: {
      type: "string[]",
      label: "Expenses",
      description: "A list of expenses assigned to this project. E.g. `[{\"name\": \"Expense 1\", \"date\": \"2022-01-01\", \"cost\": 100}]`. [See the documentation](https://developer.float.com/api_reference.html#!/Projects/addProject)",
      optional: true,
    },
    projectTasks: {
      type: "string[]",
      label: "Project Tasks",
      description: "A list of tasks assigned to this project. E.g. `[{\"phase_id\": 1, \"billable\": 1}]`. [See the documentation](https://developer.float.com/api_reference.html#!/Projects/addProject)",
      optional: true,
    },
    projectTeam: {
      propDefinition: [
        float,
        "peopleId",
      ],
      type: "string[]",
      label: "Project Team",
      description: "A list of people and their project `Hourly Rate`, the `Phase ID` will be `0`, the list may be empty. [See the documentation](https://developer.float.com/api_reference.html#!/Projects/addProject)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.float.createProject({
      $,
      data: cleanObject({
        name: this.name,
        project_code: this.projectCode,
        client_id: this.clientId,
        color: this.color,
        notes: this.notes,
        tags: this.tags,
        budget_type: this.budgetType,
        budget_total: this.budgetTotal,
        budget_priority: this.budgetPriority && parseInt(this.budgetPriority),
        default_hourly_rate: this.defaultHourlyRate && parseFloat(this.defaultHourlyRate),
        non_billable: !(+this.nonBillable),
        status: this.status && parseInt(this.status),
        stage_id: this.stageId,
        locked_task_list: this.lockedTaskList && +this.lockedTaskList,
        active: this.active && +this.active,
        project_manager_id: this.projectManagerId,
        all_pms_schedule: this.allPmsSchedule && +this.allPmsSchedule,
        start_date: this.startDate,
        end_date: this.endDate,
        expenses: parseObject(this.expenses),
        project_tasks: parseObject(this.projectTasks),
        project_team: parseObject(this.projectTeam)?.map((peopleId) => ({
          people_id: peopleId,
        })),
      }),
    });
    $.export("$summary", `Successfully created project "${this.name}"`);
    return response;
  },
};
