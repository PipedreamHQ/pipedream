// Uses Shopify GraphQL API rather than REST to get Order Transactions in the same request as Orders
// Order Transaction created_at dates are used to determine if an order's update was from being paid
// to avoid duped orders if there are more than 100 orders between updates of a paid order
const common = require("../common/graphql-orders.js");

module.exports = {
  ...common,
  key: "shopify-new-paid-order",
  name: "New Paid Order",
  description: "Emits an event each time a new order is paid.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    isRelevant(order) {
      // Don't emit if order was updated long after last transaction (update not cause by order being paid)
      let lastTransactionDate = null;
      for (const transaction of order.transactions) {
        const transactionDate = Date.parse(transaction.createdAt);
        if (!lastTransactionDate || transactionDate - lastTransactionDate > 0) {
          lastTransactionDate = transactionDate;
        }
      }
      if (!lastTransactionDate) {
        return false;
      }
      const timeFromTransactToOrderUpdate =
        Date.parse(order.updatedAt) - lastTransactionDate;
      // If the order was updated long after the last transaction, assume becoming 'paid' was not the cause of update
      // allow 5 minutes between transaction and order update
      if (timeFromTransactToOrderUpdate > 1000 * 60 * 5) {
        return false;
      }
      return true;
    },

    getParams() {
      return {
        query: "financial_status:paid",
        sortKey: "UPDATED_AT",
      };
    },
  },
};
