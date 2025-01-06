import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import easypromos from "../../easypromos.app.mjs";

export default {
  key: "easypromos-new-coin-transaction",
  name: "New Coin Transaction",
  description: "Emit new event when a user earns or spends coins. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    easypromos,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    userid: {
      propDefinition: [
        easypromos,
        "userid",
      ],
    },
    promotionid: {
      propDefinition: [
        easypromos,
        "promotionid",
      ],
    },
  },
  methods: {
    async getCoinTransactions(page = 1, perPage = 50, since = null) {
      const params = {
        promotion_id: this.promotionid,
        user_id: this.userid,
        page,
        perpage: perPage,
      };
      if (since) {
        params.since = since;
      }
      const response = await this.easypromos._makeRequest({
        method: "GET",
        path: "/coin-transactions",
        params,
      });
      return response.transactions || [];
    },
    async _getLastTimestamp() {
      return (await this.db.get("lastTimestamp")) || 0;
    },
    async _setLastTimestamp(timestamp) {
      await this.db.set("lastTimestamp", timestamp);
    },
  },
  hooks: {
    async deploy() {
      try {
        let page = 1;
        const perPage = 50;
        const fetchedTransactions = [];
        const lastTimestamp = await this._getLastTimestamp();

        while (fetchedTransactions.length < perPage) {
          const transactions = await this.getCoinTransactions(page, perPage, lastTimestamp);
          if (transactions.length === 0) break;
          fetchedTransactions.unshift(...transactions.reverse());
          if (transactions.length < perPage) break;
          page += 1;
        }

        const recentTransactions = fetchedTransactions.slice(0, perPage);
        for (const transaction of recentTransactions) {
          this.$emit(transaction, {
            id: transaction.id.toString(),
            summary: `Coin transaction: ${transaction.amount} for user ${transaction.user_id}`,
            ts: Date.parse(transaction.created),
          });
        }

        if (recentTransactions.length > 0) {
          const latestTimestamp = Date.parse(recentTransactions[0].created);
          await this._setLastTimestamp(latestTimestamp);
        }
      } catch (error) {
        this.logger.error(`Error deploying source: ${error.message}`);
      }
    },
    async activate() {
      // No webhook setup required
    },
    async deactivate() {
      // No webhook teardown required
    },
  },
  async run() {
    try {
      const lastTimestamp = await this._getLastTimestamp();
      let page = 1;
      const perPage = 50;
      const newTransactions = [];

      while (true) {
        const transactions = await this.getCoinTransactions(page, perPage, lastTimestamp);
        if (transactions.length === 0) break;

        for (const transaction of transactions) {
          const transactionTimestamp = Date.parse(transaction.created);
          if (transactionTimestamp > lastTimestamp) {
            newTransactions.push(transaction);
          }
        }

        if (transactions.length < perPage) break;
        page += 1;
      }

      for (const transaction of newTransactions) {
        this.$emit(transaction, {
          id: transaction.id.toString(),
          summary: `Coin transaction: ${transaction.amount} for user ${transaction.user_id}`,
          ts: Date.parse(transaction.created),
        });
      }

      if (newTransactions.length > 0) {
        const latestTransaction = newTransactions.reduce((a, b) =>
          Date.parse(a.created) > Date.parse(b.created)
            ? a
            : b);
        await this._setLastTimestamp(Date.parse(latestTransaction.created));
      }
    } catch (error) {
      this.logger.error(`Error running source: ${error.message}`);
    }
  },
};
