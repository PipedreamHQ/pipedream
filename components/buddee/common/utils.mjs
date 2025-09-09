import { DEFAULT_PAGINATION } from "./constants.mjs";

export const formatEmployeeName = (employee) => {
  return `${employee.first_name || ""} ${employee.last_name || ""}`.trim();
};

export const formatLeaveRequestSummary = (request) => {
  return `Leave request from employee ${request.employee_id} (${request.status})`;
};

export const formatTimeRegistrationSummary = (registration) => {
  return `Time registration for employee ${registration.employee_id} on ${registration.date}`;
};

export const buildPaginationParams = (limit, offset) => {
  const params = {};

  if (limit && limit > 0) {
    params.limit = Math.min(limit, DEFAULT_PAGINATION.MAX_LIMIT);
  }

  if (offset && offset >= 0) {
    params.offset = offset;
  }

  return params;
};

export const buildDateRangeParams = (startDate, endDate) => {
  const params = {};

  if (startDate) {
    params.start_date = startDate;
  }

  if (endDate) {
    params.end_date = endDate;
  }

  return params;
};

export const buildEmployeeFilterParams = (employeeId) => {
  const params = {};

  if (employeeId) {
    params.employee_id = employeeId;
  }

  return params;
};

export const buildStatusFilterParams = (status) => {
  const params = {};

  if (status) {
    params.status = status;
  }

  return params;
};

export const createEventSummary = (type, data) => {
  switch (type) {
  case "employee_created":
    return `New employee: ${formatEmployeeName(data)}`;
  case "employee_updated":
    return `Employee updated: ${formatEmployeeName(data)}`;
  case "leave_request_created":
    return `New leave request from employee ${data.employee_id}`;
  case "leave_request_status_changed":
    return `Leave request ${data.status}: Employee ${data.employee_id}`;
  case "time_registration_created":
    return `New time registration for employee ${data.employee_id}`;
  default:
    return `New ${type} event`;
  }
};

export const getEventTimestamp = (data, field = "created_at") => {
  return new Date(data[field]).getTime();
};
