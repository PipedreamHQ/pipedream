import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bamboohr",
  propDefinitions: {
    applicationId: {
      type: "string",
      label: "Application ID",
      description: "The ID of an application, e.g. `4521`. Run **List Application ID Options** to discover application IDs.",
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of a job, e.g. `12`. Run **List Job ID Options** to discover job IDs.",
      optional: true,
    },
    statusId: {
      type: "string",
      label: "Status ID",
      description: "The ID of a job status, e.g. `3`. Run **List Status ID Options** to discover status IDs.",
    },
    employeeId: {
      type: "string",
      label: "Employee ID",
      description: "The employee ID (e.g. `100`). Run **Get Employees Directory** to discover IDs.",
    },
    timeOffTypeId: {
      type: "string",
      label: "Time Off Type ID",
      description: "The time off type ID, e.g. `5`. Run **List Time Off Types** to discover IDs.",
    },
    requestId: {
      type: "string",
      label: "Request ID",
      description: "The time off request ID, e.g. `67890`. Run **List Time Off Requests** to discover IDs.",
    },
    reportId: {
      type: "string",
      label: "Report ID",
      description: "The saved report ID (company-specific), e.g. `1`. Find it by hovering over the report name in BambooHR's **Custom Reports** (or **My Reports**) list and noting the ID in the URL.",
    },
    fileId: {
      type: "string",
      label: "File ID",
      description: "The file ID, e.g. `789`. Run **List Employee Files** to discover file IDs.",
    },
    timesheetId: {
      type: "string",
      label: "Timesheet ID",
      description: "The timesheet ID, e.g. `456`. Run **List Timesheets** to discover IDs.",
    },
    clockEntryId: {
      type: "string",
      label: "Clock Entry ID",
      description: "The clock entry ID, e.g. `321`. Run **List Clock Entries** to discover IDs.",
    },
    hourEntryId: {
      type: "string",
      label: "Hour Entry ID",
      description: "The hour entry ID, e.g. `654`. Run **List Hour Entries** to discover IDs.",
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The legacy hour record ID, e.g. a UUID like `550e8400-e29b-41d4-a716-446655440000`. You choose this ID when calling **Create Hour Record** — save it, since it's required to update or delete that record later.",
    },
    clockDate: {
      type: "string",
      label: "Date",
      description: "Date in YYYY-MM-DD format (defaults to today), e.g. `2026-01-15`.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "IANA timezone string, e.g. `America/Chicago`.",
      optional: true,
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Optional numeric project ID, e.g. `19`. Find valid IDs in your BambooHR time tracking project settings.",
      optional: true,
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "Optional numeric task ID within the project, e.g. `47` (requires projectId). Find valid IDs in your BambooHR time tracking project settings.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://api.bamboohr.com/api/gateway.php/${this.$auth.company_domain}/v1`;
    },
    _makeRequest({
      $ = this, path, headers = {}, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: `${this.$auth.api_key}`,
          password: "x",
        },
        headers: {
          Accept: "application/json",
          ...headers,
        },
        ...opts,
      });
    },
    // Applicant tracking
    getApplication({
      applicationId, ...opts
    }) {
      return this._makeRequest({
        path: `/applicant_tracking/applications/${applicationId}`,
        ...opts,
      });
    },
    listApplications(opts = {}) {
      return this._makeRequest({
        path: "/applicant_tracking/applications",
        ...opts,
      });
    },
    listJobs(opts = {}) {
      return this._makeRequest({
        path: "/applicant_tracking/jobs",
        ...opts,
      });
    },
    listStatuses(opts = {}) {
      return this._makeRequest({
        path: "/applicant_tracking/statuses",
        ...opts,
      });
    },
    addApplicationComment({
      applicationId, ...opts
    }) {
      return this._makeRequest({
        path: `/applicant_tracking/applications/${applicationId}/comments`,
        method: "POST",
        ...opts,
      });
    },
    updateApplicationStatus({
      applicationId, ...opts
    }) {
      return this._makeRequest({
        path: `/applicant_tracking/applications/${applicationId}/status`,
        method: "POST",
        ...opts,
      });
    },
    downloadFile({
      fileId, ...opts
    }) {
      return this._makeRequest({
        path: `/files/${fileId}`,
        responseType: "arraybuffer",
        ...opts,
      });
    },
    // Employees
    getEmployeesDirectory(opts = {}) {
      return this._makeRequest({
        path: "/employees/directory",
        ...opts,
      });
    },
    getEmployee({
      employeeId, ...opts
    }) {
      return this._makeRequest({
        path: `/employees/${employeeId}`,
        ...opts,
      });
    },
    createEmployee(opts = {}) {
      return this._makeRequest({
        path: "/employees",
        method: "POST",
        ...opts,
      });
    },
    updateEmployee({
      employeeId, ...opts
    }) {
      return this._makeRequest({
        path: `/employees/${employeeId}`,
        method: "POST",
        ...opts,
      });
    },
    listChangedEmployees(opts = {}) {
      return this._makeRequest({
        path: "/employees/changed",
        ...opts,
      });
    },
    deleteEmployee({
      employeeId, ...opts
    }) {
      return this._makeRequest({
        path: `/employees/${employeeId}`,
        method: "DELETE",
        ...opts,
      });
    },
    // Employee files
    listEmployeeFiles({
      employeeId, ...opts
    }) {
      return this._makeRequest({
        path: `/employees/${employeeId}/files/view`,
        ...opts,
      });
    },
    getEmployeeFile({
      employeeId, fileId, ...opts
    }) {
      return this._makeRequest({
        path: `/employees/${employeeId}/files/${fileId}`,
        responseType: "arraybuffer",
        ...opts,
      });
    },
    // Holidays
    listCompanyHolidays(opts = {}) {
      return this._makeRequest({
        path: "/holidays",
        ...opts,
      });
    },
    // Reports
    getCompanyReport({
      reportId, params = {}, ...opts
    }) {
      const format = params.format?.toLowerCase();
      return this._makeRequest({
        path: `/reports/${reportId}`,
        params,
        responseType: (format === "pdf" || format === "xls")
          ? "arraybuffer"
          : undefined,
        ...opts,
      });
    },
    // Time off
    listTimeOffRequests(opts = {}) {
      return this._makeRequest({
        path: "/time_off/requests",
        ...opts,
      });
    },
    createTimeOffRequest({
      employeeId, ...opts
    }) {
      return this._makeRequest({
        path: `/employees/${employeeId}/time_off/request`,
        method: "PUT",
        ...opts,
      });
    },
    updateTimeOffRequestStatus({
      requestId, ...opts
    }) {
      return this._makeRequest({
        path: `/time_off/requests/${requestId}/status`,
        method: "PUT",
        ...opts,
      });
    },
    listTimeOffTypes(opts = {}) {
      return this._makeRequest({
        path: "/meta/time_off/types",
        ...opts,
      });
    },
    listTimeOffPolicies(opts = {}) {
      return this._makeRequest({
        path: "/meta/time_off/policies",
        ...opts,
      });
    },
    getTimeOffBalance({
      employeeId, ...opts
    }) {
      return this._makeRequest({
        path: `/employees/${employeeId}/time_off/calculator`,
        ...opts,
      });
    },
    adjustTimeOffBalance({
      employeeId, ...opts
    }) {
      return this._makeRequest({
        path: `/employees/${employeeId}/time_off/balance_adjustment`,
        method: "PUT",
        ...opts,
      });
    },
    updateTimeOffRequest({
      requestId, ...opts
    }) {
      return this._makeRequest({
        path: `/time-off/requests/${requestId}`,
        method: "PATCH",
        ...opts,
      });
    },
    approveTimeOffRequest({
      requestId, ...opts
    }) {
      return this._makeRequest({
        path: `/time-off/requests/${requestId}/approvals`,
        method: "POST",
        ...opts,
      });
    },
    denyTimeOffRequest({
      requestId, ...opts
    }) {
      return this._makeRequest({
        path: `/time-off/requests/${requestId}/denials`,
        method: "POST",
        ...opts,
      });
    },
    cancelTimeOffRequest({
      requestId, ...opts
    }) {
      return this._makeRequest({
        path: `/time-off/requests/${requestId}/cancellations`,
        method: "POST",
        ...opts,
      });
    },
    listWhosOut(opts = {}) {
      return this._makeRequest({
        path: "/time_off/whos_out",
        ...opts,
      });
    },
    listTimeOffRequestComments({
      requestId, ...opts
    }) {
      return this._makeRequest({
        path: `/time-off/requests/${requestId}/comments`,
        ...opts,
      });
    },
    createTimeOffRequestComment({
      requestId, ...opts
    }) {
      return this._makeRequest({
        path: `/time-off/requests/${requestId}/comments`,
        method: "POST",
        ...opts,
      });
    },
    // Timesheets (modern API)
    listTimesheets(opts = {}) {
      return this._makeRequest({
        path: "/time-tracking/timesheets",
        ...opts,
      });
    },
    getTimesheet({
      timesheetId, ...opts
    }) {
      return this._makeRequest({
        path: `/time-tracking/timesheets/${timesheetId}`,
        ...opts,
      });
    },
    approveTimesheet(opts = {}) {
      return this._makeRequest({
        path: "/time-tracking/timesheet-approvals",
        method: "POST",
        ...opts,
      });
    },
    // Clock entries (modern API)
    listClockEntries(opts = {}) {
      return this._makeRequest({
        path: "/time-tracking/clock-entries",
        ...opts,
      });
    },
    getClockEntry({
      clockEntryId, ...opts
    }) {
      return this._makeRequest({
        path: `/time-tracking/clock-entries/${clockEntryId}`,
        ...opts,
      });
    },
    createClockEntry(opts = {}) {
      return this._makeRequest({
        path: "/time-tracking/clock-entries",
        method: "POST",
        ...opts,
      });
    },
    deleteClockEntry({
      clockEntryId, ...opts
    }) {
      return this._makeRequest({
        path: `/time-tracking/clock-entries/${clockEntryId}`,
        method: "DELETE",
        ...opts,
      });
    },
    // Hour entries (modern API)
    listHourEntries(opts = {}) {
      return this._makeRequest({
        path: "/time-tracking/hour-entries",
        ...opts,
      });
    },
    createHourEntry(opts = {}) {
      return this._makeRequest({
        path: "/time-tracking/hour-entries",
        method: "POST",
        ...opts,
      });
    },
    deleteHourEntry({
      hourEntryId, ...opts
    }) {
      return this._makeRequest({
        path: `/time-tracking/hour-entries/${hourEntryId}`,
        method: "DELETE",
        ...opts,
      });
    },
    // Real-time clock in/out
    clockIn({
      employeeId, ...opts
    }) {
      return this._makeRequest({
        path: `/time_tracking/employees/${employeeId}/clock_in`,
        method: "POST",
        ...opts,
      });
    },
    clockOut({
      employeeId, ...opts
    }) {
      return this._makeRequest({
        path: `/time_tracking/employees/${employeeId}/clock_out`,
        method: "POST",
        ...opts,
      });
    },
    // Legacy timesheet entries
    listTimesheetEntries(opts = {}) {
      return this._makeRequest({
        path: "/time_tracking/timesheet_entries",
        ...opts,
      });
    },
    // Legacy Hours API
    createHourRecord(opts = {}) {
      return this._makeRequest({
        path: "/timetracking/add",
        method: "POST",
        ...opts,
      });
    },
    createOrUpdateHourRecords(opts = {}) {
      return this._makeRequest({
        path: "/timetracking/record",
        method: "POST",
        ...opts,
      });
    },
    getTimeTrackingRecord({
      recordId, ...opts
    }) {
      return this._makeRequest({
        path: `/timetracking/record/${recordId}`,
        ...opts,
      });
    },
    updateHourRecord(opts = {}) {
      return this._makeRequest({
        path: "/timetracking/adjust",
        method: "PUT",
        ...opts,
      });
    },
    deleteHourRecord({
      recordId, ...opts
    }) {
      return this._makeRequest({
        path: `/timetracking/delete/${recordId}`,
        method: "DELETE",
        ...opts,
      });
    },
  },
};
