import breathe from "../../breathe.app.mjs";

export default {
  key: "breathe-create-leave-request",
  name: "Create Leave Request",
  description: "Creates a new leave request for an employee in Breathe. [See the documentation](https://developer.breathehr.com/examples#!/employees/POST_version_employees_id_leave_requests_json)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    breathe,
    employeeId: {
      propDefinition: [
        breathe,
        "employeeId",
      ],
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the leave request. Example: `2023-12-25`",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the leave request. Example: `2023-12-27`",
    },
    halfStart: {
      type: "boolean",
      label: "Half Start",
      description: "Set to `true` if requesting a half-day",
      default: false,
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes about the leave request",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.breathe.createLeaveRequest({
      $,
      employeeId: this.employeeId,
      data: {
        leave_request: {
          start_date: this.startDate,
          end_date: this.endDate,
          half_start: this.halfStart,
          notes: this.notes,
        },
      },
    });
    $.export("$summary", `Successfully created leave for employee with ID: ${this.employeeId}`);
    return response;
  },
};
