import polygonscan from "../../polygonscan.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "polygonscan-transaction-posted",
  name: "Transaction Posted",
  description: "Emits an event when a new transaction with status 1 is posted on the PolygonScan network for a specific address.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    polygonscan,
    db: "$.service.db",
    address: {
      propDefinition: [
        polygonscan,
        "address",
      ],
    },
    startBlock: {
      propDefinition: [
        polygonscan,
        "startBlock",
      ],
    },
    endBlock: {
      propDefinition: [
        polygonscan,
        "endBlock",
      ],
    },
    page: {
      propDefinition: [
        polygonscan,
        "page",
      ],
    },
    offset: {
      propDefinition: [
        polygonscan,
        "offset",
      ],
    },
    sort: {
      propDefinition: [
        polygonscan,
        "sort",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const since = this.db.get("since") || this.startBlock;
      const transactions = await this.polygonscan.getTransactionsByAddress({
        address: this.address,
        startBlock: since,
        endBlock: this.endBlock,
        page: this.page,
        offset: this.offset,
        sort: this.sort,
      });

      const latestBlock = Math.max(...transactions.result.map((tx) => parseInt(tx.blockNumber)));
      this.db.set("since", latestBlock + 1);

      transactions.result
        .filter((txn) => txn.isError === "0" && txn.txreceipt_status === "1")
        .slice(0, 50)
        .forEach((txn) => {
          this.$emit(txn, {
            id: txn.hash,
            summary: `New transaction ${txn.hash}`,
            ts: parseInt(txn.timeStamp, 10) * 1000,
          });
        });
    },
    async activate() {
      // This code will run when the source is activated
    },
    async deactivate() {
      // This code will run when the source is deactivated
    },
  },
  methods: {
    async checkTransactions() {
      const since = this.db.get("since") || this.startBlock;
      const transactions = await this.polygonscan.getTransactionsByAddress({
        address: this.address,
        startBlock: since,
        endBlock: this.endBlock,
        page: this.page,
        offset: this.offset,
        sort: this.sort,
      });

      if (transactions.result && transactions.result.length > 0) {
        transactions.result.forEach((transaction) => {
          if (transaction.isError === "0" && transaction.txreceipt_status === "1") {
            this.$emit(transaction, {
              id: transaction.hash,
              summary: `New transaction ${transaction.hash}`,
              ts: Date.parse(transaction.timeStamp) * 1000,
            });
          }
        });

        const latestBlock = Math.max(...transactions.result.map((tx) => parseInt(tx.blockNumber)));
        this.db.set("since", latestBlock + 1);
      }
    },
  },
  async run() {
    await this.checkTransactions();
  },
};
