const APPLICATION_STATUS_GROUPS = [
  "ALL",
  "ALL_ACTIVE",
  "NEW",
  "ACTIVE",
  "INACTIVE",
  "HIRED",
];

const JOB_STATUS_GROUPS = [
  "ALL",
  "DRAFT_AND_OPEN",
  "Open",
  "Filled",
  "Draft",
  "Deleted",
  "On Hold",
  "Canceled",
];

const APPLICATION_SORT_FIELDS = [
  "first_name",
  "job_title",
  "rating",
  "phone",
  "status",
  "last_updated",
  "created_date",
];

const REPORT_FORMATS = [
  "json",
  "xml",
  "csv",
  "xls",
  "pdf",
];

const TIME_OFF_REQUEST_STATUSES = [
  "approved",
  "denied",
  "declined",
  "canceled",
];

const TIME_OFF_CREATE_STATUSES = [
  "approved",
  "denied",
  "declined",
  "requested",
];

const EMPLOYEE_CHANGE_TYPES = [
  "inserted",
  "updated",
  "deleted",
  "all",
];

const TIME_OFF_LIST_STATUSES = [
  "approved",
  "denied",
  "superceded",
  "requested",
  "canceled",
];

const TIMESHEET_STATUSES = [
  "OPEN",
  "PENDING_APPROVAL",
  "APPROVED",
];

export default {
  APPLICATION_STATUS_GROUPS,
  JOB_STATUS_GROUPS,
  APPLICATION_SORT_FIELDS,
  REPORT_FORMATS,
  TIME_OFF_REQUEST_STATUSES,
  TIME_OFF_CREATE_STATUSES,
  EMPLOYEE_CHANGE_TYPES,
  TIME_OFF_LIST_STATUSES,
  TIMESHEET_STATUSES,
};
