import buddee from "../../buddee.app.mjs";

export default {
  name: "Create Leave Request",
  description: "Creates a new leave request. [See the documentation](https://developers.buddee.nl/#b5a0cea5-e416-4521-8bc1-46cc4c3d95cb)",
  key: "buddee-create-leave-request",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    buddee,
    employeeId: {
      propDefinition: [
        buddee,
        "employeeId",
      ],
    },
    leaveTypeId: {
      propDefinition: [
        buddee,
        "leaveTypeId",
      ],
    },
    hours: {
      type: "string",
      label: "Hours",
      description: "Number of leave hours",
      optional: true,
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "Reason for the leave",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date of the leave request (YYYY-MM-DD)",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Start time of the leave request (HH:MM)",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date of the leave request (YYYY-MM-DD)",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "End time of the leave request (HH:MM)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.buddee.createLeaveRequest({
      $,
      data: {
        employee_id: this.employeeId,
        leave_type_id: this.leaveTypeId,
        hours: this.hours && parseFloat(this.hours),
        reason: this.reason,
        start_date: this.startDate,
        start_time: this.startTime,
        end_date: this.endDate,
        end_time: this.endTime,
      },
    });

    $.export("$summary", `Successfully created leave request with ID: ${response.data.id}`);
    return response.data;
  },
};
