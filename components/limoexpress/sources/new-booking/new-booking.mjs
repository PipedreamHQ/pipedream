import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { checkNumbers } from "../../common/utils.mjs";
import app from "../../limoexpress.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "limoexpress-new-booking",
  name: "New Limo Booking Created",
  description: "Emit new event when a customer creates a new limo booking. [See the documentation](https://api.limoexpress.me/api/docs/v1#/Bookings/createBooking)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastNumber() {
      return this.db.get("lastNumber") || 0;
    },
    _setLastNumber(lastNumber) {
      this.db.set("lastNumber", lastNumber);
    },
    async emitEvent(maxResults = false) {
      const lastNumber = this._getLastNumber();

      const response = this.app.paginate({
        fn: this.app.listBookings,
        params: {
          order: "desc",
          order_by: "id",
        },
      });

      let responseArray = [];
      for await (const item of response) {
        const numbers = item.number.split("/");
        if (checkNumbers(numbers, lastNumber)) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastNumber(responseArray[0].number.split("/"));
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: `New Booking: ${item.id}`,
          ts: Date.now(),
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
