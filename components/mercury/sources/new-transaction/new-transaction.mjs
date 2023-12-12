import mercury from "../../mercury.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "mercury-new-transaction",
  name: "New Transaction",
  description: "Emit new event for each transaction in an account.",
  version: "0.0.3",
  dedupe: "unique",
  type: "source",
  props: {
    mercury,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    account: {
      propDefinition: [
        mercury,
        "account",
      ],
    },
  },
  methods: {
    getMeta(transaction) {
      const {
        id, counterpartyName: summary, postedAt,
      } = transaction;
      const ts = new Date(postedAt).getTime();
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run({ $ }) {
    const lastRunTime = this.db.get("lastRunTime")
      ? new Date(this.db.get("lastRunTime"))
      : this.mercury.daysAgo(1);
    const params = {
      limit: 100,
      offset: 0,
      start: lastRunTime.toISOString().split("T")[0],
    };
    let totalTransactions = params.limit;
    while (totalTransactions == params.limit) {
      const results = await this.mercury.getTransactions({
        ctx: $,
        accountId: this.account,
        params,
      });
      const { transactions } = results;
      totalTransactions = transactions.length;
      for (const transaction of transactions) {
        this.$emit(transaction, this.getMeta(transaction));
      }
      params.offset += params.limit;
    }
    this.db.set("lastRunTime", new Date());
  },
};
