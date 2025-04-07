import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "lucca-new-expense-report",
  name: "New Expense Report Created",
  description: "Emit new event when a new expense report is created by an employee. Useful for automating approval or finance workflows. [See the documentation](https://developers.lucca.fr/api-reference/legacy/cleemy-expenses/expenseclaims/list-expenseclaims)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.app.listExpenseClaims;
    },
    getSummary(item) {
      return `New expense report: ${item.name}`;
    },
  },
  sampleEmit,
};
