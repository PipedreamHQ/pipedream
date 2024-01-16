import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "oyster-new-expense",
  name: "New Expense",
  description: "Emit new event when a new expense is created in Oyster. [See the documentation](https://docs.oysterhr.com/reference/get_v1-expenses)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "submittedAt";
    },
    getResourceFn() {
      return this.oyster.listExpenses;
    },
    generateMeta(expense) {
      return {
        id: expense.expenseId,
        summary: `New Expense ${expense.expenseId}`,
        ts: Date.parse(expense.submittedAt),
      };
    },
  },
  sampleEmit,
};
