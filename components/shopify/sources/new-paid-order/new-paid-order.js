const shopify = require("../../shopify.app.js");
const { dateToISOStringWithoutMs } = require("../common/utils");

/**
 * The component's run timer.
 * @constant {number}
 * @default 300 (5 minutes)
 */
const DEFAULT_TIMER_INTERVAL_SECONDS = 60 * 5;

/**
 * The minimum time interval from Order Transaction to Order update where the
 * Order update will be considered the result of the Transaction.
 * Note: From testing, an Order (`financial_status:=PAID`) seems to be updated
 * within 15s of the Transaction.
 * @constant {number}
 * @default 30000 (30 seconds)
 */
const MIN_ALLOWED_TRANSACT_TO_ORDER_UPDATE_MS = 1000 * 30 * 1;

/**
 * Uses Shopify GraphQL API to get Order Transactions (`created_at`) in the same
 * request as Orders (`updated_at`). Order Transaction `created_at` dates are
 * used to determine if a `PAID` Order's update was from being paid - to avoid
 * duped orders if there are more than 100 orders between updates of a `PAID`
 * Order.
 *
 * Data from GraphQL request is used to generate list of relevant Order IDs.
 * Relevent Orders are requested via Shopify REST API using list of relevant
 * Order IDs.
 */
module.exports = {
  key: "shopify-new-paid-order",
  name: "New Paid Order",
  description: "Emits an event each time a new order is paid.",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_TIMER_INTERVAL_SECONDS,
      },
    },
    shopify,
  },
  methods: {
    _getPrevCursor() {
      return this.db.get("prevCursor") || null;
    },
    _setPrevCursor(prevCursor) {
      this.db.set("prevCursor", prevCursor);
    },
    /**
     * Returns the allowed time interval between Order Transaction and Order
     * update where the Order update can still be considered the result of
     * becoming 'paid'.
     *
     * @returns {number} The number of milliseconds after a Transaction is created
     */
    _getAllowedTransactToOrderUpdateMs() {
      return Math.max(
        MIN_ALLOWED_TRANSACT_TO_ORDER_UPDATE_MS,
        2 * DEFAULT_TIMER_INTERVAL_SECONDS * 1000,
      );
    },
    /**
     * Gets the fields to include in a GraphQL query.
     *
     * To get the query fields for an Orders query like this,
     * @example
     * {
     *   orders {
     *     edges {
     *       node {
     *         updatedAt
     *         name
     *         legacyResourceId
     *         transactions {
     *           createdAt
     *         }
     *       }
     *     }
     *   }
     * }
     * the function would look like this:
     * @example
     * function getQueryFields() {
     *   return [
     *     "updatedAt",
     *     "name",
     *     "legacyResourceId",
     *     "transactions.createdAt",
     *   ];
     * }
     *
     * @returns {string[]} The GraphQL query fields
     */
    getQueryFields() {
      // See https://shopify.dev/docs/admin-api/graphql/reference/orders/order
      // With these fields and a limit of 100, queries cost up to 202 points
      return [
        "updatedAt",
        "name",
        "legacyResourceId", // The ID of the corresponding resource (Order) in the REST Admin API.
        "transactions.createdAt",
      ];
    },
    /**
     * Gets the filter string to be used in a GraphQL query.
     * @param {object} opts Options for creating the query filter
     * @param {string} [opts.updatedAt=null] The minimum `updated_at` time to
     * allow in queried resources
     * @returns The query filter string
     */
    getQueryFilter({ updatedAt = null }) {
      return `financial_status:paid updated_at:>${updatedAt}`;
    },
    isRelevant(order) {
      // Don't emit if Order was updated long after last Transaction (update not
      // caused by order being paid)
      let lastTransactionDate = null;
      // Iterate over Order Transactions to get date of most recent Transaction
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
      // - If the Order was updated long after the last Transaction, assume
      // becoming 'paid' was not the cause of update.
      // - Allow at least 2x the timer interval (2 * 5min) after an Order
      // Transaction for Order updates to be considered 'paid' updates.
      // - If 2x the timer interval isn't allowed, some Orders that are updated
      // from a Transaction and then one or more times between polling requests
      // could be considered not 'paid' by the update (because time from Order
      // Transaction `created_at` to Order `updated_at` would be too large).
      // - The larger interval could cause Orders updated multiple times within
      // the interval to be considered 'paid' twice, but those Order events
      // would be deduped if there are fewer than 100 paid Orders in 2x timer
      // inverval.
      return (
        timeFromTransactToOrderUpdate <
        this._getAllowedTransactToOrderUpdateMs()
      );
    },

    generateMeta(order) {
      return {
        id: order.id,
        summary: `Order paid: ${order.name}`,
        ts: Date.parse(order.updated_at),
      };
    },
  },

  async run() {
    const prevCursor = this._getPrevCursor();
    const queryOrderOpts = {
      fields: this.getQueryFields(),
      filter: this.getQueryFilter({
        // If there is no cursor yet, get orders updated_at after 1 day ago
        // The Shopify GraphQL Admin API does not accept date ISO strings that include milliseconds
        updatedAt: prevCursor
          ? null
          : dateToISOStringWithoutMs(this.shopify.dayAgo()),
      }),
      prevCursor,
    };
    const orderStream = this.shopify.queryOrders(queryOrderOpts);
    const relevantOrderIds = [];
    for await (const orderInfo of orderStream) {
      const {
        order,
        cursor,
      } = orderInfo;

      if (this.isRelevant(order)) {
        relevantOrderIds.push(order.legacyResourceId);
      }

      this._setPrevCursor(cursor);
    }

    const relevantOrders = await this.shopify.getOrdersById(relevantOrderIds);

    relevantOrders.forEach((order) => {
      const meta = this.generateMeta(order);
      this.$emit(order, meta);
    });
  },
};
