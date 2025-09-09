import { API_ENDPOINTS } from "../../common/constants.mjs";

export default {
  name: "Create Leave Request",
  description: "Employee creates a new time-off request",
  key: "createLeaveRequest",
  version: "0.1.0",
  type: "action",
  props: {
    buddee: {
      type: "app",
      app: "buddee",
      label: "Buddee",
      description: "The Buddee app instance to use",
    },
    employeeId: {
      type: "string",
      label: "Employee ID",
      description: "ID of the employee requesting leave",
      required: true,
    },
    leaveTypeId: {
      type: "string",
      label: "Leave Type ID",
      description: "ID of the leave type (vacation, personal, etc.)",
      required: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date of the leave request (YYYY-MM-DD)",
      required: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date of the leave request (YYYY-MM-DD)",
      required: true,
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "Reason for the leave request",
    },
    halfDay: {
      type: "boolean",
      label: "Half Day",
      description: "Whether this is a half-day leave request",
      default: false,
    },
    morningHalfDay: {
      type: "boolean",
      label: "Morning Half Day",
      description: "If half day, whether it's morning or afternoon",
      default: false,
    },
  },
  async run({ $ }) {
    const data = {
      employee_id: this.employeeId,
      leave_type_id: this.leaveTypeId,
      start_date: this.startDate,
      end_date: this.endDate,
    };

    if (this.reason) {
      data.reason = this.reason;
    }
    if (this.halfDay) {
      data.half_day = this.halfDay;
    }
    if (this.morningHalfDay) {
      data.morning_half_day = this.morningHalfDay;
    }

    const response = await this.buddee._makeRequest({
      $,
      method: "POST",
      path: API_ENDPOINTS.LEAVE_REQUESTS,
      data,
    });

    return response.data;
  },
};
