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
// Each ${...} is an FTL interpolation resolved server-side by Expensify. String
// fields are passed through ?json_string so quotes/backslashes/newlines in the
// data don't produce invalid JSON; numeric fields (total, amount) use ?c
// (computer number format) so locale grouping can't produce invalid JSON.
export const REPORT_LIST_FTL_TEMPLATE = "[<#list reports as report>{\"reportID\":\"${(report.reportID!\"\")?json_string}\",\"reportName\":\"${(report.reportName!\"\")?json_string}\",\"total\":${(report.total!0)?c},\"status\":\"${(report.status!\"\")?json_string}\",\"submitterEmail\":\"${(report.submitterEmail!\"\")?json_string}\",\"currency\":\"${(report.currency!\"\")?json_string}\",\"managerEmail\":\"${(report.managerEmail!\"\")?json_string}\",\"policyID\":\"${(report.policyID!\"\")?json_string}\"}<#if report?has_next>,</#if></#list>]";

// Freemarker template: emits one report object with nested transactionList line items.
export const REPORT_DETAIL_FTL_TEMPLATE = "[<#list reports as report>{\"reportID\":\"${(report.reportID!\"\")?json_string}\",\"reportName\":\"${(report.reportName!\"\")?json_string}\",\"total\":${(report.total!0)?c},\"status\":\"${(report.status!\"\")?json_string}\",\"submitterEmail\":\"${(report.submitterEmail!\"\")?json_string}\",\"currency\":\"${(report.currency!\"\")?json_string}\",\"managerEmail\":\"${(report.managerEmail!\"\")?json_string}\",\"policyID\":\"${(report.policyID!\"\")?json_string}\",\"transactionList\":[<#list report.transactionList![] as expense>{\"transactionID\":\"${(expense.transactionID!\"\")?json_string}\",\"amount\":${(expense.amount!0)?c},\"currency\":\"${(expense.currency!\"\")?json_string}\",\"merchant\":\"${(expense.merchant!\"\")?json_string}\",\"created\":\"${(expense.created!\"\")?json_string}\",\"category\":\"${(expense.category!\"\")?json_string}\",\"receiptURL\":\"${((expense.receiptObject.url)!\"\")?json_string}\",\"comment\":\"${(expense.comment!\"\")?json_string}\"}<#if expense?has_next>,</#if></#list>]}<#if report?has_next>,</#if></#list>]";

// Freemarker template: emits a flat JSON array of transaction/expense objects across all reports.
export const EXPENSE_LIST_FTL_TEMPLATE = "[<#assign sep=\"\"><#list reports as report><#list report.transactionList![] as expense>${sep}{\"transactionID\":\"${(expense.transactionID!\"\")?json_string}\",\"reportID\":\"${(report.reportID!\"\")?json_string}\",\"amount\":${(expense.amount!0)?c},\"currency\":\"${(expense.currency!\"\")?json_string}\",\"merchant\":\"${(expense.merchant!\"\")?json_string}\",\"created\":\"${(expense.created!\"\")?json_string}\",\"category\":\"${(expense.category!\"\")?json_string}\",\"receiptURL\":\"${((expense.receiptObject.url)!\"\")?json_string}\",\"comment\":\"${(expense.comment!\"\")?json_string}\"}<#assign sep=\",\"></#list></#list>]";
