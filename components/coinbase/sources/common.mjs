import common from "../common.mjs";
import constants from "../constants.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    _setLastTransactionId(transactionId) {
      this.db.set(constants.LAST_TRANSACTION_ID, transactionId);
    },
    _getLastTransactionId() {
      return this.db.get(constants.LAST_TRANSACTION_ID);
    },
  },
};
