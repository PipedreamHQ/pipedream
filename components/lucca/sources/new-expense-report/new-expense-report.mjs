import { axios } from "@pipedream/platform";
import lucca from "../../lucca.app.mjs";

export default {
  key: "lucca-new-expense-report",
  name: "New Expense Report Created",
  description: "Emit new event when a new expense report is created by an employee. Useful for automating approval or finance workflows. [See the documentation](https://developers.lucca.fr/api-reference/legacy/cleemy-expenses/expenseclaims/list-expenseclaims)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    lucca,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 3600, // polling interval of 1 hour
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetching and emitting the latest 50 expense claims on deploy
      const expenseClaims = await this.lucca.listExpenseClaims({
        params: {
          orderBy: "createdOn,desc",
          paging: "0,50",
        },
      });

      for (const expenseClaim of expenseClaims.slice(0, 50)) {
        this.$emit(expenseClaim, {
          id: expenseClaim.id,
          summary: `New expense report: ${expenseClaim.name}`,
          ts: Date.parse(expenseClaim.createdOn),
        });
      }
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp");
    },
    _setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp() || 0;
    const expenseClaims = await this.lucca.listExpenseClaims({
      params: {
        declaredOn: `since,${new Date(lastTimestamp).toISOString()}`,
        orderBy: "createdOn,asc",
      },
    });

    for (const expenseClaim of expenseClaims) {
      const timestamp = Date.parse(expenseClaim.createdOn);
      if (timestamp > lastTimestamp) {
        this.$emit(expenseClaim, {
          id: expenseClaim.id,
          summary: `New expense report: ${expenseClaim.name}`,
          ts: timestamp,
        });
        this._setLastTimestamp(timestamp);
      }
    }
  },
};
