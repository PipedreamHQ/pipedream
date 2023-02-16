import { defineSource } from "@pipedream/types";
import common from "../common/common";

export default defineSource({
  ...common,
  key: "clientary-new-expense-created",
  name: "New Expense Created",
  description: "Emit new events when a new expense was created. [See the docs](https://www.clientary.com/api/expenses)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getConfig() {
      return {
        resourceFnName: "getExpenses",
        resourceName: "expenses",
        hasPaging: false,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSummary(item: any): string {
      return `New expense ${item.description} - ${item.amount} ID(${item.id})`;
    },
  },
});
