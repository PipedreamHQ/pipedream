import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ramp-transaction-status-updated",
  name: "Transaction Status Updated",
  description: "Emit new event when there is a change in transaction status.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    departmentId: {
      propDefinition: [
        common.props.ramp,
        "departmentId",
      ],
    },
    locationId: {
      propDefinition: [
        common.props.ramp,
        "locationId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.ramp.listTransactions;
    },
    getParams() {
      return {
        order_by_date_asc: true,
        department_id: this.departmentId,
        location_id: this.locationId,
      };
    },
    generateMeta(transaction) {
      const ts = Date.now();
      return {
        id: `${transaction.id}-${ts}`,
        summary: `Status updated for transaction ID: ${transaction.id}`,
        ts,
      };
    },
    emitResults(results, max) {
      const previousStatuses = this._getPreviousStatuses();
      let transactions = [];
      for (const transaction of results) {
        if (previousStatuses[transaction.id]
          && previousStatuses[transaction.id] !== transaction.state) {
          transactions.push(transaction);
        }
        previousStatuses[transaction.id] = transaction.state;
      }
      this._setPreviousStatuses(previousStatuses);
      if (!transactions.length) {
        return;
      }
      if (max && transactions.length > max) {
        transactions = transactions.slice(-1 * max);
      }
      transactions.reverse().forEach((transaction) => {
        const meta = this.generateMeta(transaction);
        this.$emit(transaction, meta);
      });
    },
  },
  sampleEmit,
};
