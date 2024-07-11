import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ramp-new-transaction-created",
  name: "New Transaction Created",
  description: "Emit new event for each new transaction created in Ramp.",
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
    _getLatestTransactionId() {
      return this.db.get("latestTransactionId");
    },
    _setLatestTransactionId(id) {
      this.db.set("latestTransactionId", id);
    },
    getResourceFn() {
      return this.ramp.listTransactions;
    },
    getParams() {
      const latestTransactionId = this._getLatestTransactionId();
      const params = {
        order_by_date_asc: true,
        department_id: this.departmentId,
        location_id: this.locationId,
      };
      if (latestTransactionId) {
        params.start = latestTransactionId;
      }
      return params;
    },
    generateMeta(transaction) {
      return {
        id: transaction.id,
        summary: `New Transaction ID: ${transaction.id}`,
        ts: Date.parse(transaction.user_transaction_time),
      };
    },
    emitResults(results, max) {
      if (max && results.length > max) {
        results = results.slice(-1 * max);
      }
      this._setLatestTransactionId(results[results.length - 1].id);
      results.reverse().forEach((transaction) => {
        const meta = this.generateMeta(transaction);
        this.$emit(transaction, meta);
      });
    },
  },
  sampleEmit,
};
