import buddee from "../../buddee.app.mjs";

export default {
  name: "List Leave Requests",
  description: "Retrieves all leave requests. [See the documentation](https://developers.buddee.nl/#2c5f483b-63d4-4ecf-a9d1-7efe36563639)",
  key: "buddee-list-leave-requests",
  version: "0.0.1",
  type: "action",
  props: {
    buddee,
    employeeId: {
      propDefinition: [
        buddee,
        "employeeId",
      ],
      description: "Filter leave requests by specific employee ID",
      optional: true,
    },
    leaveTypeId: {
      propDefinition: [
        buddee,
        "leaveTypeId",
      ],
      description: "Filter leave requests by specific leave type ID",
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
      fn: this.buddee.getLeaveRequests,
      maxResults: this.maxResults,
      params: {
        employee_id: this.employeeId,
        leave_type_id: this.leaveTypeId,
      },
    });

    const responseArray = [];
    for await (const leaveRequest of response) {
      responseArray.push(leaveRequest);
    }

    $.export("$summary", `Found ${responseArray.length} leave requests`);
    return responseArray;
  },
};
