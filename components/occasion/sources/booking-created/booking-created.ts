import { defineSource } from "@pipedream/types";
import { DOCS } from "../../common/constants";
import { Order } from "../../common/types";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import occasion from "../../app/occasion.app";

export default defineSource({
  key: "occasion-booking-created",
  name: "Booking Created",
  description: `Emit new event for each new booking [See docs here](${DOCS.bookingCreated})`,
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    occasion,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL as number,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData();
    },
  },
  methods: {
    sortByTimestamp<T extends Order>(a: T, b: T) {
      return (
        Date.parse(a.attributes["created-at"]) -
        Date.parse(b.attributes["created-at"])
      );
    },
    async getAndProcessData() {
      const data: Order[] = await this.occasion.getOrders();
      data.sort(this.sortByTimestamp).forEach(this.emitEvent);
    },
    emitEvent(data: Order) {
      const { id, attributes } = data;

      this.$emit(data, {
        id,
        summary: `Order ID ${id}`,
        ts: Date.parse(attributes["created-at"]),
      });
    },
  },
  async run() {
    await this.getAndProcessData();
  },
});
