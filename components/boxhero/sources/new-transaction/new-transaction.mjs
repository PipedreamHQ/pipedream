import boxhero from "../../boxhero.app.mjs";
import constants from "../../common/constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "boxhero-new-transaction",
  name: "New Transaction",
  description: "Emit new event when a transaction occurs. [See the documentation](https://docs-en.boxhero-app.com/integrations-and-api/boxhero-api-reference#v1-txs)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    boxhero,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    transactionType: {
      type: "string",
      label: "Transaction Type",
      description: "Filter events by transaction type",
      options: constants.TRANSACTION_TYPE,
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastCreatedTs() {
      return this.db.get("lastCreatedTs") || 0;
    },
    _setLastCreatedTs(lastCreatedTs) {
      this.db.set("lastCreatedTs", lastCreatedTs);
    },
    emitEvent(transaction) {
      const meta = this.generateMeta(transaction);
      this.$emit(transaction, meta);
    },
    generateMeta(transaction) {
      return {
        id: transaction.id,
        summary: `New Transaction ${transaction.id}`,
        ts: Date.parse(transaction.created_at),
      };
    },
    async getTeamMode() {
      const { mode } = await this.boxhero.getTeam();
      return mode;
    },
    async processEvent(max) {
      const lastCreatedTs = this._getLastCreatedTs();
      let maxTs = lastCreatedTs;

      const teamMode = await this.getTeamMode();
      const resourceFn = teamMode === 0
        ? this.boxhero.listBasicTransactions
        : this.boxhero.listLocationTransactions;

      const results = this.boxhero.paginate({
        resourceFn,
        params: this.transactionType
          ? {
            type: this.transactionType,
          }
          : {},
        max,
      });

      const transactions = [];
      for await (const transaction of results) {
        const ts = Date.parse(transaction.created_at);
        if (ts > lastCreatedTs) {
          transactions.push(transaction);
          if (ts > maxTs) {
            maxTs = ts;
          }
        }
      }

      transactions.reverse().forEach((transaction) => this.emitEvent(transaction));

      this._setLastCreatedTs(maxTs);
    },
  },
  async run() {
    await this.processEvent();
  },
  sampleEmit,
};
