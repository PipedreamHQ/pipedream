import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_books-new-expense-instant",
  name: "New Expense (Instant)",
  description: "Emit new event when a new expense is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEntity() {
      return "expense";
    },
    generateMeta({ expense }) {
      return {
        id: expense.expense_id,
        summary: `New Expense: ${expense.expense_id}`,
        ts: Date.parse(expense.created_time),
      };
    },
  },
  sampleEmit,
};
