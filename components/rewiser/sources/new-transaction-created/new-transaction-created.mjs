import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import rewiser from "../../rewiser.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "rewiser-new-transaction-created",
  name: "New Transaction Created",
  description: "Emit new event when a new transaction is created in Rewiser. [See the documentation](https://rewiser.io/api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    rewiser,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
    alert: {
      type: "alert",
      alertType: "info",
      content: "This endpoint automatically returns only transactions created within the last 1 hour (maximum 100 records) to optimize polling and prevent duplicate triggers.",
    },
  },
  methods: {
    getLastDate() {
      return this.db.get("lastDate") || "1970-01-01T00:00:00.000Z";
    },
    setLastDate(date) {
      return this.db.set("lastDate", date);
    },
  },
  async run() {
    const responseArray = [];
    let lastDate = this.getLastDate();
    const { data: transactions } = await this.rewiser.getRecentTransactions();

    for (const transaction of transactions) {
      if (Date.parse(transaction.created_at) < Date.parse(lastDate)) {
        break;
      }
      responseArray.push(transaction);
    }

    if (responseArray.length > 0) {
      this.setLastDate(responseArray[0].created_at);
    }

    for (const transaction of responseArray.reverse()) {
      this.$emit(transaction, {
        id: transaction.id,
        summary: `New Transaction: ${transaction.name} (${transaction.amount})`,
        ts: Date.parse(transaction.created_at),
      });
    }
  },
  sampleEmit,
};
