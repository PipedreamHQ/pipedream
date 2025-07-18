import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import ifthenpay from "../../ifthenpay.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "ifthenpay-new-payment",
  name: "New Payment Completed",
  description: "Emit new event when a payment is successfully completed through Ifthenpay. [See the documentation](https://ifthenpay.com/docs/en/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ifthenpay,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || "1970-01-01 00:00:00";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();

      const { payments: response } = await this.ifthenpay.listPayments({
        data: {
          dateStart: lastDate,
        },
      });

      if (response.length) {
        if (maxResults && (response.length > maxResults)) {
          response.length = maxResults;
        }
        this._setLastDate(response[0].paymentDate);
      }

      for (const item of response.reverse()) {
        this.$emit(item, {
          id: item.requestId,
          summary: `New Payment: ${parseFloat(item.amount)} ${item.entity}`,
          ts: Date.parse(item.paymentDate),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
  sampleEmit,
};
