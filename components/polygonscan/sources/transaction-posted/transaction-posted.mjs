import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import polygonscan from "../../polygonscan.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "polygonscan-transaction-posted",
  name: "New Transaction Posted",
  description: "Emit new event when a new transaction is posted on the PolygonScan network for a specific address.",
  version: "0.0.1",
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
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastBlockNumber() {
      return this.db.get("lastBlockNumber") || 0;
    },
    _setLastBlockNumber(lastBlockNumber = null) {
      this.db.set("lastBlockNumber", lastBlockNumber);
    },
    async startEvent(maxResults = 0) {
      const lastBlockNumber = this._getLastBlockNumber();

      const response = this.polygonscan.paginate({
        fn: this.polygonscan.getTransactionsByAddress,
        maxResults,
        params: {
          startblock: lastBlockNumber,
          address: this.address,
          sort: "desc",
        },
      });

      let responseArray = [];

      for await (const item of response) {
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastBlockNumber(responseArray[0].blockNumber);

      for (const item of responseArray) {
        this.$emit(item, {
          id: item.blockNumber,
          summary: `New transaction with hash: ${item.hash}`,
          ts: item.timeStamp,
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
