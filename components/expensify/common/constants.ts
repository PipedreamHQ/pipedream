export const REPORT_STATES = [
  "OPEN",
  "SUBMITTED",
  "APPROVED",
  "REIMBURSED",
  "ARCHIVED",
];
export const REIMBURSED_STATUS = "REIMBURSED";

export const INPUT_SETTINGS_TYPE = Object.freeze({
  COMBINED_REPORT_DATA: "combinedReportData",
  REPORT_STATUS: "reportStatus",
});

export const JOB_TYPE = Object.freeze({
  FILE: "file",
  DOWNLOAD: "download",
  UPDATE: "update",
  GET: "get",
});

export const FILE_SYSTEM = "integrationServer";
export const JSON_FILE_EXTENSION = "json";
export const MIN_LIMIT = 1;
export const MAX_LIMIT = 1000;

// Freemarker template: emits a JSON array of report-level summary objects.
// Each ${...} is an FTL interpolation resolved server-side by Expensify.
export const REPORT_LIST_FTL_TEMPLATE = "[<#list reports as report>{\"reportID\":\"${report.reportID!\"\"}\",\"reportName\":\"${report.reportName!\"\"}\",\"total\":${report.total!0},\"status\":\"${report.status!\"\"}\",\"submitterEmail\":\"${report.submitterEmail!\"\"}\",\"currency\":\"${report.currency!\"\"}\",\"managerEmail\":\"${report.managerEmail!\"\"}\",\"policyID\":\"${report.policyID!\"\"}\"}<#if report?has_next>,</#if></#list>]";

// Freemarker template: emits one report object with nested transactionList line items.
export const REPORT_DETAIL_FTL_TEMPLATE = "[<#list reports as report>{\"reportID\":\"${report.reportID!\"\"}\",\"reportName\":\"${report.reportName!\"\"}\",\"total\":${report.total!0},\"status\":\"${report.status!\"\"}\",\"submitterEmail\":\"${report.submitterEmail!\"\"}\",\"currency\":\"${report.currency!\"\"}\",\"managerEmail\":\"${report.managerEmail!\"\"}\",\"policyID\":\"${report.policyID!\"\"}\",\"transactionList\":[<#list report.transactionList![] as expense>{\"transactionID\":\"${expense.transactionID!\"\"}\",\"amount\":${expense.amount!0},\"currency\":\"${expense.currency!\"\"}\",\"merchant\":\"${expense.merchant!\"\"}\",\"created\":\"${expense.created!\"\"}\",\"category\":\"${expense.category!\"\"}\",\"receiptURL\":\"${expense.receiptUrl!\"\"}\",\"comment\":\"${expense.comment!\"\"}\"}<#if expense?has_next>,</#if></#list>]}<#if report?has_next>,</#if></#list>]";

// Freemarker template: emits a flat JSON array of transaction/expense objects across all reports.
export const EXPENSE_LIST_FTL_TEMPLATE = "[<#assign sep=\"\"><#list reports as report><#list report.transactionList![] as expense>${sep}{\"transactionID\":\"${expense.transactionID!\"\"}\",\"reportID\":\"${report.reportID!\"\"}\",\"amount\":${expense.amount!0},\"currency\":\"${expense.currency!\"\"}\",\"merchant\":\"${expense.merchant!\"\"}\",\"created\":\"${expense.created!\"\"}\",\"category\":\"${expense.category!\"\"}\",\"receiptURL\":\"${expense.receiptUrl!\"\"}\",\"comment\":\"${expense.comment!\"\"}\"}<#assign sep=\",\"></#list></#list>]";
