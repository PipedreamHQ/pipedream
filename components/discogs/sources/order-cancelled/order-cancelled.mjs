import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "discogs-order-cancelled",
  name: "Order Cancelled",
  description: "Emits an event when an order status changes to 'Cancelled'. [See the documentation](https://www.discogs.com/developers#page:marketplace,header:marketplace-list-orders)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getStatus() {
      return "Cancelled";
    },
    getSummary(id) {
      return `Order ${id} is cancelled`;
    },
  },
  sampleEmit,
};
