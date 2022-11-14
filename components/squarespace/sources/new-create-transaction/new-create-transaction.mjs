import squarespace from "../../squarespace.app.mjs";
import dayjs from "dayjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Create Transaction",
  version: "0.0.2",
  key: "squarespace-new-create-transaction",
  description: "Emit new event for each transaction created.",
  type: "source",
  dedupe: "unique",
  props: {
    squarespace,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  async run({ $ }) {
    const transactions = await this.squarespace.getTransactions({
      params: {
        modifiedAfter: dayjs().subtract(2, "day")
          .toISOString(),
      },
      $,
    });

    for (const transaction of transactions) {
      this.$emit(transaction, {
        id: transaction.id,
        summary: `New transaction ${transaction.id} created`,
        ts: Date.parse(transaction.createdOn),
      });
    }
  },
};
