import { API_ENDPOINTS } from "../../common/constants.mjs";
import {
  buildDateRangeParams,
  buildEmployeeFilterParams,
  buildPaginationParams,
} from "../../common/utils.mjs";

export default {
  name: "List Time Registrations",
  description: "Get all time tracking records",
  key: "listTimeRegistrations",
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
      description: "Filter time registrations by specific employee ID",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Filter from this date (YYYY-MM-DD)",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Filter until this date (YYYY-MM-DD)",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of time registrations to return",
      default: 100,
      min: 1,
      max: 1000,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of time registrations to skip",
      default: 0,
      min: 0,
    },
  },
  async run({ $ }) {
    const params = {
      ...buildPaginationParams(this.limit, this.offset),
      ...buildEmployeeFilterParams(this.employeeId),
      ...buildDateRangeParams(this.startDate, this.endDate),
    };

    const response = await this.buddee._makeRequest({
      $,
      path: API_ENDPOINTS.TIME_REGISTRATIONS,
      params,
    });

    return response.data;
  },
};
