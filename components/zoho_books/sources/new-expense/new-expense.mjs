import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_books-new-expense",
  name: "New Expense",
  description: "Emit new event when a new expense is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.zohoBooks.listExpenses;
    },
    getFieldName() {
      return "expenses";
    },
    getFieldId() {
      return "expense_id";
    },
    getSummary(item) {
      return `New Expense: ${item.expense_id}`;
    },
  },
  sampleEmit,
};
