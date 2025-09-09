import {
  API_ENDPOINTS, LEAVE_REQUEST_STATUS,
} from "../../common/constants.mjs";
import {
  buildEmployeeFilterParams,
  buildPaginationParams,
  buildStatusFilterParams,
} from "../../common/utils.mjs";

export default {
  name: "List Leave Requests",
  description: "Get all pending and processed leave requests",
  key: "listLeaveRequests",
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
      description: "Filter leave requests by specific employee ID",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter by leave request status",
      options: [
        {
          label: "All",
          value: "",
        },
        {
          label: "Pending",
          value: LEAVE_REQUEST_STATUS.PENDING,
        },
        {
          label: "Approved",
          value: LEAVE_REQUEST_STATUS.APPROVED,
        },
        {
          label: "Rejected",
          value: LEAVE_REQUEST_STATUS.REJECTED,
        },
        {
          label: "Cancelled",
          value: LEAVE_REQUEST_STATUS.CANCELLED,
        },
      ],
      default: "",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of leave requests to return",
      default: 100,
      min: 1,
      max: 1000,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of leave requests to skip",
      default: 0,
      min: 0,
    },
  },
  async run({ $ }) {
    const params = {
      ...buildPaginationParams(this.limit, this.offset),
      ...buildEmployeeFilterParams(this.employeeId),
      ...buildStatusFilterParams(this.status),
    };

    const response = await this.buddee._makeRequest({
      $,
      path: API_ENDPOINTS.LEAVE_REQUESTS,
      params,
    });

    return response.data;
  },
};
