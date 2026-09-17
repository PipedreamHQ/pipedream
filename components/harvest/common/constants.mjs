export default {
  HTTP_PROTOCOL: "https://",
  BASE_URL: "api.harvestapp.com",
  VERSION_PATH: "/v2",
  PAGE_SIZE: 100,
  // Cap for tools that auto-paginate to completion (list-time-entries, list-invoices, etc.) —
  // bounds worst-case wall clock and result size instead of fetching an account's entire
  // history unbounded. Documented in each such tool's description. Kept modest rather than
  // Harvest's own page-size ceiling (2000) because these tools return full, unshaped objects
  // (nested project/task/user/client sub-objects) with no field-selection param — a large
  // cap here produces a response too big for the calling agent to usefully read in one call.
  MAX_AUTO_PAGINATE_RECORDS: 200,
  RETRIABLE_STATUS_CODES: [
    408,
    429,
    500,
  ],
  DB_LAST_DATE_CHECK: "DB_LAST_DATE_CHECK",
  REPORT_BY_OPTIONS: Object.freeze([
    "clients",
    "projects",
    "tasks",
    "team",
  ]),
  BILL_BY_OPTIONS: Object.freeze([
    "Project",
    "Tasks",
    "People",
    "none",
  ]),
  BUDGET_BY_OPTIONS: Object.freeze([
    "project",
    "project_cost",
    "task",
    "task_fees",
    "person",
    "none",
  ]),
  INVOICE_STATE_OPTIONS: Object.freeze([
    "draft",
    "open",
    "paid",
    "closed",
  ]),
  ACCESS_ROLE_OPTIONS: Object.freeze([
    "member",
    "manager",
    "administrator",
  ]),
};
