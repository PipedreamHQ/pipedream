import common from "../common/polling.mjs";

export default {
  ...common,
  key: "zoho_expense-expense-report-approved",
  name: "Expense Report Approved",
  description: "Activate when an expense report approval takes place. [See the Documentation](https://www.zoho.com/expense/api/v1/expense-reports/#list-of-all-expense-reports).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "expense_reports";
    },
    getResourceFn() {
      return this.app.listExpenseReports;
    },
    getResourceFnArgs() {
      return {
        params: {
          filter_by: "Type.Approval,Status.Approved",
        },
      };
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.last_modified_time);
      return {
        id: `${resource.report_id}-${ts}`,
        summary: `Expense Report Approved: ${resource.report_name}`,
        ts,
      };
    },
  },
};
